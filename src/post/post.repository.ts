import { Injectable } from '@nestjs/common';
import { Post } from './post.model';
import { getObjectKeysByGeneric } from 'src/common/consts';

type ReadPostOption = {
  id: number;
};

@Injectable()
export class PostRepository {
  private readonly POST_LIST: Array<Post> = Array.from(
    { length: 100 },
    (_, index: number) => {
      return {
        id: index,
        title: `title ${index}`,
        content: `content ${index}`,
        writerId: Math.floor(index % 10),
      };
    },
  );

  async readPostList(option: ReadPostOption): Promise<Array<Post>> {
    const optionKeyList = getObjectKeysByGeneric<ReadPostOption>(option);

    return this.POST_LIST.filter((post) => {
      return (
        optionKeyList.filter((optionKey) => {
          return post[optionKey] === option[optionKey];
        }).length === optionKeyList.length
      );
    });
  }
}
