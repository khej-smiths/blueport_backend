import { Injectable, Scope } from '@nestjs/common';
import DataLoader, { BatchLoadFn } from 'dataloader';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { In } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class UserDataLoaderService {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * @ref https://blog.siner.io/2021/12/11/graphql-dataloader/
   * @param userIdList
   * @returns
   */
  // TODO dataLoader가 여러 키를 하나로 묶어 주는 것 까진 이해를 했는데, 어떻게 load에 키를 다 쌓고나면.... 그걸 알아서 인식해서 DB 콜로 넘어가는건지 모르겠음
  readonly getUsersByIds = new DataLoader<string, User>(
    async (userIdList: Array<string>) => {
      console.log('getUsersByIDs', userIdList);
      const users: Array<User> = await this.userRepository.readUserList({
        where: {
          id: In(userIdList),
        },
      });
      return userIdList.map((userId) => {
        return users.find((user) => user.id === userId) ?? new Error();
      });
    },
  );
}
