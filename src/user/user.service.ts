import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { CustomGraphQLError } from 'src/common/error';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserInputDto } from './dtos/create-user.dto';
import { CustomLogger } from 'src/logger/logger';
import { IOLogger } from 'src/logger/log.decorator';

@Injectable()
@IOLogger()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly logger: CustomLogger,
  ) {}

  /**
   * @description 유저 생성
   * @param input name, email
   * @returns
   */
  async createUser(input: CreateUserInputDto): Promise<User> {
    // 에러의 앞에 달 prefix 선언
    const errPrefix = `${this.constructor.name} - ${this.createUser.name}`;

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

      // 유저 생성 후 나온 에러가 커스텀 에러인 경우 prefix 추가
      if (error.extensions?.customFlag) {
        error.addBriefStacktraceToCode(errPrefix);
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
    userId?: number;
    email?: string;
  }): Promise<User> {
    // 에러의 앞에 달 prefix 선언
    const errPrefix = `${this.constructor.name} - ${this.readUserByOption.name}`;

    // 이 함수에서 발생하는 에러 케이스 정리
    const ERR_NO_OPTION = 'ERR_NO_OPTION'; // 유저 조회를 위한 옵션이 알맞게 설정되지 않은 경우
    const ERR_NO_USER = 'ERR_NO_USER'; // 유저가 조회되지 않은 경우
    const ERR_MULTIPLE_USER = 'ERR_MULTIPLE_USER'; // 조회된 유저가 여럿인 경우

    try {
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
      const userList = await this.userRepository.readUserList({
        where: {
          ...(option.userId && { id: option.userId }),
          ...(option.email && { email: option.email }),
        },
      });

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
    } catch (error) {
      if (error.extensions.customFlag === true) {
        error.addBriefStacktraceToCode(errPrefix);
      }
      throw error;
    }
  }
}
