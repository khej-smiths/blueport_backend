import { Test, TestingModule } from '@nestjs/testing';
import { UserDataLoaderService } from '../user.data-loader';
import { UserRepository } from '../user.repository';
import { User } from '../user.entity';

describe('UserDataLoaderService', () => {
  let userDataLoaderService: UserDataLoaderService;
  let userRepository: UserRepository;

  // 유저 모듈 셋팅
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserDataLoaderService,
        {
          provide: UserRepository,
          useValue: {
            readUserList: jest.fn(),
          },
        },
      ],
    }).compile();

    userDataLoaderService = await module.resolve<UserDataLoaderService>(
      UserDataLoaderService,
    );
    userRepository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(userDataLoaderService).toBeDefined();
  });

  it('getUsersByIds는 입력받은 순서대로 유저를 리턴하는가?', async () => {
    // 입력받을 유저 id
    const userIds = ['1', '2'];
    // 조회된 유저 객체 > 입력받은 유저 id와 순서가 다르다.
    const users: User[] = [
      { id: '2', blog: [] } as unknown as User,
      { id: '1', blog: [] } as unknown as User,
    ];
    (userRepository.readUserList as jest.Mock).mockResolvedValue(users);

    const result = await userDataLoaderService.getUsersByIds.loadMany(userIds);

    // toHaveBeenCalledWith: mock 함수가 특정 인자로 호출되었는지 확인하는 Matcher 함수
    // expect.anything(): 무조건 어떤 값이어도 상관없으나 단 null, undefined는 안된다.
    // 내부에서 함수를 잘 호출했는지 확인
    expect(userRepository.readUserList).toHaveBeenCalledWith({
      where: { id: expect.anything() },
      relations: ['blog'],
    });
    // 입력받은 id 순서에 맞춰서 리턴했는지 확인
    expect(result).toEqual([
      { id: '1', blog: [] },
      { id: '2', blog: [] },
    ]);
  });

  it('getUsersByIds: 유저가 없는 경우 에러 리턴', async () => {
    // 유저 id 목록과 조회된 유저의 개수가 다름
    const userIds = ['1', '2'];
    const users: User[] = [{ id: '1', blog: [] } as unknown as User];
    (userRepository.readUserList as jest.Mock).mockResolvedValue(users);

    // 유저 조회
    const result = await userDataLoaderService.getUsersByIds.loadMany(userIds);

    // 입력받은 user id와 달라 에러 리턴
    expect(result[0]).toEqual(users[0]);
    expect(result[1]).toBeInstanceOf(Error);
  });
});
