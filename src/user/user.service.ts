import { Injectable } from '@nestjs/common';
import { User } from './user.model';

@Injectable()
export class UserService {
  async readUserByOption(option: { postId?: number }): Promise<User> {
    if (Object.keys(option).length > 1) {
      throw new Error('too much options');
    }

    return {
      id: 3,
      name: 'name',
    };
  }
}
