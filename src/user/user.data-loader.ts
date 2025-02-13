import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
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

  /**
   * !STUDY
   * TODO dataLoader에 load로 키 값을 넣어주는 것으로 어떻게 batch로 데이터를 정리해서 db에 호출할 수 있는지 로직을 확인해야함 > (노션) 대강의 흐름은 이해했으나 완벽하게는 이해하지 못함
   * @ref https://medium.com/@bhryan1013/n-1%EC%9D%84-%ED%95%B4%EA%B2%B0%ED%95%98%EB%8A%94-dataloader%EC%9D%98-%EB%A7%88%EB%B2%95%EA%B0%99%EC%9D%80-%EC%9D%B4%EC%95%BC%EA%B8%B0-feat-node-js-%EC%9D%98-event-loop-aa740d6dade9
   * @ref https://medium.com/zigbang/dataloader%EB%A1%9C-non-graphql%ED%99%98%EA%B2%BD%EC%97%90%EC%84%9C-%ED%99%9C%EC%9A%A9%ED%95%98%EA%B8%B0-e6619010f60b
   * @ref https://www.korecmblog.com/blog/node-js-event-loop
   */
  readonly getUsersByIds = new DataLoader<string, User>(
    async (userIdList: Array<string>) => {
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
