import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { CustomGraphQLError } from 'src/common/error';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserInputDto } from './dtos/create-user.dto';
import { Wrapper } from 'src/logger/log.decorator';
import { LoggerStorage } from 'src/logger/logger-storage';
import { UpdateUserInputDto } from './dtos/update-user.dto';

@Injectable()
@Wrapper()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly als: LoggerStorage,
  ) {}

  /**
   * @description 유저 생성
   * @param input name, email
   * @returns
   */
  async createUser(input: CreateUserInputDto): Promise<User> {
    // 이 함수에서 발생하는 에러 케이스 정리
    const ERR_DUPLICATION_EMAIL = 'ERR_DUPLICATION_EMAIL'; // 이메일이 중복된 경우

    try {
      // 유저 생성
      const user = await this.userRepository.createUser(input);

      // 유저 리턴
      return user;
    } catch (error) {
      // user 테이블에서 email을 고유키로 설정해둠
      if (error.code === 'ER_DUP_ENTRY') {
        error = new CustomGraphQLError(
          '유저의 이메일이 중복되어 확인이 필요합니다.',
          {
            extensions: { code: ERR_DUPLICATION_EMAIL },
          },
        );
      }

      throw error;
    }
  }

  /**
   * @description 옵션에 맞게 유저 조회
   * @param option: userId
   * @returns: User
   */
  async readUserByOption(option: {
    where?: { id?: string; email?: string };
    relations?: Array<string>;
  }): Promise<User> {
    // 이 함수에서 발생하는 에러 케이스 정리
    const ERR_NO_OPTION = 'ERR_NO_OPTION'; // 유저 조회를 위한 옵션이 알맞게 설정되지 않은 경우
    const ERR_NO_USER = 'ERR_NO_USER'; // 유저가 조회되지 않은 경우
    const ERR_MULTIPLE_USER = 'ERR_MULTIPLE_USER'; // 조회된 유저가 여럿인 경우

    // option으로 들어온 항목을 카운트
    const keyListLength = Object.keys(option).length;

    // 옵션이 1개도 선택되지 않은 경우 에러 처리
    if (!option || keyListLength === 0) {
      throw new CustomGraphQLError(
        '유저 조회를 위한 옵션이 설정되지 않았습니다.',
        {
          extensions: { code: ERR_NO_OPTION },
        },
      );
    }

    // 유저 조회
    const userList = await this.userRepository.readUserList(option);

    if (
      // 유저가 없는 경우 에러 처리
      !userList ||
      userList.length === 0
    ) {
      throw new CustomGraphQLError('유저가 조회되지 않습니다.', {
        extensions: {
          code: ERR_NO_USER,
        },
      });
    } else if (
      // 유저가 여러개인 경우 에러 처리
      userList.length > 1
    ) {
      throw new CustomGraphQLError('조건에 맞는 유저가 여러명입니다.', {
        extensions: { code: ERR_MULTIPLE_USER },
      });
    } else {
      // 유저가 1개만 조회된 경우 값을 리턴
      return userList[0];
    }
  }

  // TODO 비밀번호 업데이트의 경우 유저 인증 필요
  async updateUser(user: User, input: UpdateUserInputDto): Promise<User> {
    // 함수에서 나타날 수 있는 에러 케이스
    const ERR_NO_UPDATE = 'ERR_NO_UPDATE'; // 업데이트에 실패한 경우

    // 유저 업데이트
    const result = await this.userRepository.updateUser(user.id, input);

    // 업데이트에 실패한 경우 에러 처리
    if (result.affected === 0) {
      throw new CustomGraphQLError('업데이트를 하지 못했습니다.', {
        extensions: {
          code: ERR_NO_UPDATE,
        },
      });
    }

    // 기존 유저에 업데이트한 정보를 추가해서 유저 리턴
    return {
      ...user,
      ...(input.name && { name: input.name }),
    } as User;
  }
}
