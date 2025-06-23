import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { DataSource } from 'typeorm';
import { LoggerStorage } from 'src/logger/logger-storage';
import { CreateUserInputDto } from './dtos/create-user.dto';
import { User } from './user.entity';
import { CustomGraphQLError } from 'src/common/error';

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
    it('옵션이 1개도 선택되지 않은 경우 에러 처리', () => {});
    it('유저가 없는 경우 에러 처리', () => {});
    it('유저가 여럿 선택된 경우 에러 처리', () => {});
    it('유저 리턴', () => {});
  });
  describe('updateUser', () => {
    it('유저가 업데이트 되지 않은 경우 에러 처리', () => {});
    it('유저 업데이트 후 업데이트된 유저 정보를 리턴', () => {});
  });
});
