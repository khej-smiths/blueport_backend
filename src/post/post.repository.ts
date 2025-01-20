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
  // constructor 로직의 경우 보여지는 코드 상으로 직접 사용하지는 않으나, 부모 클래스에 필요하다
  constructor(private dataSource: DataSource) {
    super(Post, dataSource.createEntityManager());
  }

  /**
   * @description 게시글을 추가하기
   * @param option
   */
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
