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
      throw new Error('키가 필수로 들어가야함');
    } else if (keyListLength > 1) {
      throw new CustomGraphQLError('유저 조회를 위한 옵션이 잘못 설정됨', {
        extensions: { code: 'ERR_OPTION_FOR_USER' },
      });
    }

    // const userList = await this.userRepository.readUserList({
    //   id: option.userId,
    // });

    // return userList[0];
    return {} as User;
  }
}
