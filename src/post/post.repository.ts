import { Injectable } from '@nestjs/common';
import { Post } from './post.entity';
import { getObjectKeysByGeneric } from 'src/common/consts';
import { CreatePostInputDto } from './dtos/create-post.dto';

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

  /**
   * @description 게시글을 추가하기
   * @param option
   */
  async createPost(option: CreatePostInputDto): Promise<Post> {
    try {
      // option을 이용해 POST_LIST에 넣을 객체 셋팅하기
      const newPostId =
        Math.max(...this.POST_LIST.map((per) => per.id).sort()) + 1;

      const newPost: Post = {
        ...option,
        id: newPostId,
        writerId: newPostId,
      };

      this.POST_LIST.push(newPost);

      return newPost;
    } catch (e) {
      throw e;
    }
  }

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
