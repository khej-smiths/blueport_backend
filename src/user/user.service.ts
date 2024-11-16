import { Injectable } from '@nestjs/common';
import { User } from './user.model';
import { CustomGraphQLError, ERR_MSG } from 'src/common/error';

@Injectable()
export class UserService {
  async readUserByOption(option: {
    postId?: number;
    userId?: number;
  }): Promise<User> {
    const keyListLength = Object.keys(option).length;

    if (keyListLength === 0) {
      throw new Error('키가 필수로 들어가야함');
    } else if (keyListLength > 1) {
      throw new CustomGraphQLError('유저 조회를 위한 옵션이 잘못 설정됨', {
        extensions: { code: 'ERR_OPTION_FOR_USER' },
      });
    }

    return {
      id: 3,
      name: 'name',
    };
  }
}
