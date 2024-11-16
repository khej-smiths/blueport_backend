import { Injectable } from '@nestjs/common';
import { Post } from './post.model';

type ReadPostOption = {
  id: number;
};

@Injectable()
export class PostRepository {
  private readonly POST_LIST: Array<Post> = Array.from(
    { length: 100 },
    (index: number) => {
      return {
        id: index,
        title: `title ${index}`,
        content: `content ${index}`,
      };
    },
  );

  async readPostList(option: ReadPostOption): Promise<Array<Post>> {
    const optionKeyList = this.getObjectKeysByGeneric<ReadPostOption>(option);

    return this.POST_LIST.filter((post) => {
      optionKeyList.filter((optionKey) => {
        return post[optionKey] === option[optionKey];
      }).length === optionKeyList.length;
    });
  }

  private getObjectKeysByGeneric<T extends object>(object: T): Array<keyof T> {
    return Object.keys(object) as unknown as Array<keyof T>;
  }
}
