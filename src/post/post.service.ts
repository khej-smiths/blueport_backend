import { Injectable } from '@nestjs/common';
import { Post, PostInputType } from './post.model';
import { ReadPostInputDto } from './dtos/read-post.dto';
import { PostRepository } from './post.repository';
import { CustomGraphQLError } from 'src/common/error';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}
  async readPost(input: ReadPostInputDto): Promise<Post> {
    try {
      const postList = await this.postRepository.readPostList({ id: input.id });

      if (postList.length === 0) {
        throw new CustomGraphQLError('게시글 조회에 실패했습니다.', {
          extensions: {
            code: 'NO_DATA',
          },
        });
      } else if (postList.length > 1) {
        throw new CustomGraphQLError('선택된 게시글이 여러개입니다.', {
          extensions: {
            code: 'MULTIPLE_DATA',
          },
        });
      } else {
        return postList[0];
      }
    } catch (e) {
      if (
        [
          '게시글 조회에 실패했습니다.',
          '선택된 게시글이 여러개입니다.',
        ].includes(e.message)
      ) {
        throw e;
      } else {
        throw new CustomGraphQLError('어떤 에러인지모르겠어요', {
          extensions: {
            code: 'MULTIPLE_DATA',
          },
        });
      }
    }
  }

  async createPost(input: PostInputType): Promise<Post> {
    return input;
  }
}
