import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { getObjectKeysByGeneric } from 'src/common/consts';

type ReadUserOption = {
  id?: number;
};

@Injectable()
export class UserRepository {
  // private readonly USER_LIST: Array<User> = Array.from(
  //   { length: 10 },
  //   (_, index: number) => {
  //     return {
  //       id: index,
  //       name: `name ${index}`,
  //     };
  //   },
  // );
  // async readUserList(option: ReadUserOption): Promise<Array<User>> {
  //   const optionKeyList = getObjectKeysByGeneric<ReadUserOption>(option);
  //   return this.USER_LIST.filter((user) => {
  //     return (
  //       optionKeyList.filter((optionKey) => {
  //         return user[optionKey] === option[optionKey];
  //       }).length === optionKeyList.length
  //     );
  //   });
  // }
}
