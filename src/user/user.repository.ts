import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { DataSource, FindManyOptions, Repository, UpdateResult } from 'typeorm';
import { CreateUserInputDto } from './dtos/create-user.dto';
import { UpdateUserInputDto } from './dtos/update-user.dto';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  /**
   * @description 유저 생성
   * @param input name, email
   * @returns
   */
  async createUser(input: CreateUserInputDto): Promise<User> {
    const creation = await this.create(input);
    const user = await this.save(creation);
    return user;
  }

  /**
   * @description: 조건에 따라 유저 조회
   * @param option
   * @returns
   */
  async readUserList(option: FindManyOptions<User>): Promise<Array<User>> {
    const userList = await this.find(option);
    return userList;
  }

  async updateUser(
    id: string,
    input: UpdateUserInputDto,
  ): Promise<UpdateResult> {
    const creation = await this.create({
      ...(input.password && { password: input.password }),
      ...(input.name && { name: input.name }),
    });

    return await this.update({ id }, creation);
  }
}
