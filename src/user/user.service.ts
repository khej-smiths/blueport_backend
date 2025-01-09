import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { CustomGraphQLError } from 'src/common/error';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async readUserByOption(option: { userId?: number }): Promise<User> {
    const keyListLength = Object.keys(option).length;

    if (keyListLength === 0) {
      throw new CustomGraphQLError('유저 조회를 위한 옵션이 설정되지 않음', {
        extensions: { code: 'ERR_OPTION_FOR_USER' },
      });
    } else if (keyListLength > 1) {
      throw new CustomGraphQLError('유저 조회를 위한 옵션이 잘못 설정됨', {
        extensions: { code: 'ERR_OPTION_FOR_USER' },
      });
    }

    const userList = await this.userRepository.readUserList({
      where: { id: option.userId },
    });

    if (!userList || userList.length === 0) {
      throw new CustomGraphQLError('유저가 조회되지 않음', {
        extensions: { code: 'NO_USER' },
      });
    } else if (userList.length > 1) {
      throw new CustomGraphQLError('유저가 여러명 조회됨', {
        extensions: { code: 'MULTIPLE_USER' },
      });
    } else {
      return userList[0];
    }
  }
}
