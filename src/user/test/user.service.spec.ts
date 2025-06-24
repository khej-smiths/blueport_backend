import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { DataSource, UpdateResult } from 'typeorm';
import { LoggerStorage } from 'src/logger/logger-storage';
import { CreateUserInputDto } from './dtos/create-user.dto';
import { User } from './user.entity';
import { CustomGraphQLError } from 'src/common/error';
import { UpdateUserInputDto } from './dtos/update-user.dto';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;

  // 서비스를 위한 UserService 셋팅
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        UserRepository,
        {
          provide: DataSource, // DataSource를 Mock으로 등록
          useValue: {
            createEntityManager: jest.fn(), // createEntityManager 함수 Mock
          },
        },
        /**
         * LoggerStorage의 경우 내부에서 의존성을 주입받는 @Injectable 클래스이기 때문에
         * 클래스를 이용해 인스턴스를 생성할 수 있도록 useClass로 셋팅
         */
        LoggerStorage,
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);

    /**
     * 데코레이터(@Wrapper)로 UserService를 감싸고있는데,
     * 거기에서 this.als로 customLogger 를 가져오는데, 그 로직을 mock으로 구현
     */
    (userService as any).als = {
      getStore: () => ({
        CustomLogger: { customLog: jest.fn() },
      }),
    };
  });

  describe('UserService', () => {
    it('should be defined?', () => {
      expect(userService).toBeDefined();
    });
  });

  describe('createUser', () => {
    // mock 계정 생성용 데이터
    const input: CreateUserInputDto = {
      name: '테스터',
      email: 'test@test.com',
      password: 'test_pw_123!',
    };

    // 생성될 Mock 계정
    const user: User = {
      id: 'uuid',
      hashPassword: jest.fn(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...input,
    };

    it('계정 생성 후 유저 리턴', async () => {
      jest.spyOn(userRepository, 'createUser').mockResolvedValue(user);
      await expect(userService.createUser(input)).resolves.toEqual(user);
    });

    it('이메일이 중복된 경우 에러 리턴', async () => {
      const duplicationError = Object.assign(new Error(), {
        code: 'ER_DUP_ENTRY',
      });

      jest
        .spyOn(userRepository, 'createUser')
        .mockRejectedValue(duplicationError);

      try {
        await userService.createUser(input);
        fail('에러 발생');
      } catch (error) {
        /////////////////////////////////////////////////////////////////////////////////////////
        // 커스텀 에러(CustomGraphQLError)의 경우,                                             //
        // 코드 및 메세지에 각각 발생 위치와 시간이 적혀져 있기 때문에 toContains로 확인해야함 //
        /////////////////////////////////////////////////////////////////////////////////////////
        // 에러 코드 확인
        expect(error.extensions.code).toContain('ERR_DUPLICATION_EMAIL');
        // 에러 인스턴스 확인
        expect(error).toBeInstanceOf(CustomGraphQLError);
        // 에러 메세지 확인
        expect(error.message).toContain(
          '유저의 이메일이 중복되어 확인이 필요합니다.',
        );
      }
    });
  });

  describe('readUserByOption', () => {
    // 생성될 Mock 계정
    const user: User = {
      id: 'uuid',
      hashPassword: jest.fn(),
      createdAt: new Date(),
      updatedAt: new Date(),
      name: '테스터',
      email: 'test@test.com',
      password: 'test_pw_123!',
    };

    it('옵션이 1개도 선택되지 않은 경우 에러 처리', async () => {
      // option 객체는 있으나 필드가 없는 경우
      const option = {};

      try {
        await userService.readUserByOption(option);
        fail('옵션이 1개도 선택되지 않은 경우 에러 발생');
      } catch (error) {
        // 에러 코드 확인
        expect(error.extensions.code).toContain('ERR_NO_OPTION');
        // 에러 인스턴스 확인
        expect(error).toBeInstanceOf(CustomGraphQLError);
        // 에러 메세지 확인
        expect(error.message).toContain(
          '유저 조회를 위한 옵션이 설정되지 않았습니다.',
        );
      }
    });

    // option이 제대로 들어간 상태에서, 유저가 없는지? 유저가 여럿인지? 유효한지 확인할 때 사용하는 변수
    const option = {
      where: { id: 'id' },
    };

    it('유저가 없는 경우 에러 처리', async () => {
      // 유저가 하나도 안넘어온 경우
      jest.spyOn(userRepository, 'readUserList').mockResolvedValue([]);

      try {
        await userService.readUserByOption(option);
        fail('유저가 없는 경우 에러 발생');
      } catch (error) {
        // 에러 코드 확인
        expect(error.extensions.code).toContain('ERR_NO_USER');
        // 에러 인스턴스 확인
        expect(error).toBeInstanceOf(CustomGraphQLError);
        // 에러 메세지 확인
        expect(error.message).toContain('유저가 조회되지 않습니다.');
      }
    });

    it('유저가 여럿 선택된 경우 에러 처리', async () => {
      // 유저가 여러명 넘어온 경우
      jest
        .spyOn(userRepository, 'readUserList')
        .mockResolvedValue([user, user]);

      try {
        await userService.readUserByOption(option);
        fail('유저가 여러명 조회된 경우 에러 발생');
      } catch (error) {
        // 에러 코드 확인
        expect(error.extensions.code).toContain('ERR_MULTIPLE_USER');
        // 에러 인스턴스 확인
        expect(error).toBeInstanceOf(CustomGraphQLError);
        // 에러 메세지 확인
        expect(error.message).toContain('조건에 맞는 유저가 여러명입니다.');
      }
    });

    it('유저 리턴', async () => {
      // 리턴된 유저가 1개인 경우
      jest.spyOn(userRepository, 'readUserList').mockResolvedValue([user]);

      await expect(userService.readUserByOption(option)).resolves.toEqual(user);
    });
  });
  describe('updateUser', () => {
    // 업데이트될 유저의 Mock 계정
    const user: User = {
      id: 'uuid',
      hashPassword: jest.fn(),
      createdAt: new Date(),
      updatedAt: new Date(),
      name: '테스터',
      email: 'test@test.com',
      password: 'test_pw_123!',
    };

    it('유저가 업데이트 되지 않은 경우 에러 처리', async () => {
      const updateResult: UpdateResult = { affected: 0 } as any;
      const input: UpdateUserInputDto = {};

      jest.spyOn(userRepository, 'updateUser').mockResolvedValue(updateResult);

      try {
        await userService.updateUser(user, input);
        fail('유저 업데이트 실패');
      } catch (error) {
        // 에러 코드 확인
        expect(error.extensions.code).toContain('ERR_NO_UPDATE');
        // 에러 인스턴스 확인
        expect(error).toBeInstanceOf(CustomGraphQLError);
        // 에러 메세지 확인
        expect(error.message).toContain('업데이트를 하지 못했습니다.');
      }
    });
    it('유저 업데이트 후 업데이트된 유저 정보를 리턴', async () => {
      const updateResult: UpdateResult = { affected: 1 } as any;
      const input: UpdateUserInputDto = { name: '수정된 이름' };

      jest.spyOn(userRepository, 'updateUser').mockResolvedValue(updateResult);

      // 유저 정보 + 업데이트할 정보 같이 리턴
      await expect(userService.updateUser(user, input)).resolves.toEqual({
        ...user,
        ...input,
      });
    });
  });
});
