import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { FindManyOptions, Repository } from 'typeorm';

@Injectable()
export class UserRepository extends Repository<User> {
  /**
   * @description: 조건에 따라 유저 조회
   * @param option
   * @returns
   */
  async readUserList(option: FindManyOptions<User>): Promise<Array<User>> {
    const userList = await this.find(option);
    return userList;
  }
}
