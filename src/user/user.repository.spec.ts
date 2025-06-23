import { DataSource } from 'typeorm';
import { UserRepository } from './user.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from './user.entity';

/**
 * describe: 테스트 그룹(묶음)을 만들 때 사용
 * it: 실제 테스트 케이스(단일 시나리오)를 작성할 때 사용
 */
describe('UserRepository', () => {
  let userRepository: UserRepository;
  let dataSource: DataSource;

  // 각 테스트 전에 실행
  beforeEach(async () => {
    /**
     * NestJS의 의존성 주입(DI)구조에 맞춰 코드가 작성되었기 때문에,
     * 생성자에 DataSource를 주입받아야하는 UserRepository의 경우,
     *  제대로 주입받기 위해 createTestingModule로 의존성 주입 환경을 유사하게 구현해야한다.
     *
     * 이 때, 실제 UserModule과 똑같이 주입할 필요는 없으며, UserRepository에 필요한 만큼만 등록하여 테스트 모듈을 구현
     */
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository, // UserRepository를 provider로 등록
        {
          provide: DataSource, // DataSource를 Mock으로 등록
          useValue: {
            createEntityManager: jest.fn(), // createEntityManager 함수 Mock
          },
        },
      ],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('userRepository', () => {
    it('should be defined?', () => {
      expect(userRepository).toBeDefined();
    });

    it('UserRepository가 User Entity용으로 생성된 것이 맞는가?', () => {
      expect(userRepository.target).toBe(User);
    });
  });

  describe('createUser', () => {
    it('생성된 유저 객체가 잘 리턴되는가?', async () => {
      /////////////////////////////
      // 1. 데이터 및 함수 모킹 //
      /////////////////////////////
      // 모킹을 위한 데이터 생성
      const input = {
        name: 'test_name',
        email: 'test_email',
        password: 'test_password',
      };
      // create 메서드 모킹시 사용할 데이터 생성
      const mockCreatedUser: User = {
        ...input,
        id: 'test-uuid',
        createdAt: new Date(),
        updatedAt: new Date(),
        hashPassword: jest.fn(),
      };
      // create 메스드 모킹
      jest.spyOn(userRepository, 'create').mockReturnValue(mockCreatedUser);
      // save 메서드 모킹
      jest.spyOn(userRepository, 'save').mockResolvedValue(mockCreatedUser);

      ////////////////////////////////////////////////
      //  2. 생성한 계정이 input의 값들과 동일한가? //
      ////////////////////////////////////////////////

      await expect(userRepository.createUser(input)).resolves.toEqual({
        ...mockCreatedUser,
      });
    });
  });
  // describe('readUserList', () => {});
  // describe('updateUser', () => {});
});
