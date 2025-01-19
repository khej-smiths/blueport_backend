import { Injectable } from '@nestjs/common';
import { Post } from './post.entity';
import { getObjectKeysByGeneric } from 'src/common/consts';
import { CreatePostInputDto } from './dtos/create-post.dto';
import { DataSource, Repository } from 'typeorm';

type ReadPostOption = {
  id: number;
};

@Injectable()
export class PostRepository extends Repository<Post> {
  constructor(private dataSource: DataSource) {
    super(Post, dataSource.createEntityManager());
  }
  // private readonly POST_LIST: Array<Post> = Array.from(
  //   { length: 100 },
  //   (_, index: number) => {
  //     return {
  //       id: index,
  //       title: `title ${index}`,
  //       content: `content ${index}`,
  //       writerId: Math.floor(index % 10),
  //     };
  //   },
  // );
  /**
  //  * @description 게시글을 추가하기
  //  * @param option
  //  */

  async createPost(
    option: CreatePostInputDto,
    userInfo: { id: string },
  ): Promise<Post> {
    const creation = await this.create({ ...option, writerId: userInfo.id });
    const post = await this.save(creation);

    return post;
  }

  async readPostList(option: ReadPostOption): Promise<Array<Post>> {
    return [{}] as Array<Post>;
  }

  // async readPostList(option: ReadPostOption): Promise<Array<Post>> {
  //   const optionKeyList = getObjectKeysByGeneric<ReadPostOption>(option);
  //   return this.POST_LIST.filter((post) => {
  //     return (
  //       optionKeyList.filter((optionKey) => {
  //         return post[optionKey] === option[optionKey];
  //       }).length === optionKeyList.length
  //     );
  //   });
  // }
}
