import { Injectable } from '@nestjs/common';
import { Post } from './post.entity';
import { ReadPostInputDto } from './dtos/read-post.dto';
import { PostRepository } from './post.repository';
import { CustomGraphQLError } from 'src/common/error';
import { CreatePostInputDto } from './dtos/create-post.dto';
import { User } from 'src/user/user.entity';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  /**
   * @description: 게시글 작성하기
   * @param input
   * @returns
   */
  async createPost(user: User, input: CreatePostInputDto): Promise<Post> {
    const prefix = `${this.constructor.name} - ${this.createPost.name}`;

    const ERR_NO_FIELD = 'ERR_NO_FIELD';

    try {
      const post = await this.postRepository.createPost(input, { id: user.id });

      return post;
    } catch (error) {
      if (error.code === 'ER_NO_DEFAULT_FOR_FIELD') {
        error = new CustomGraphQLError(
          '유저의 게시글을 작성하기 위한 정보가 부족합니다.',
          {
            extensions: { code: ERR_NO_FIELD },
          },
        );
      }

      if (error.extensions?.customFlag) {
        error.addBriefStacktraceToCode(prefix);
      }

      throw error;
    }
  }

  async readPost(input: ReadPostInputDto): Promise<Post> {
    const ERR_NO_DATA = 'ERR_NO_DATA';
    const ERR_MULTIPLE_DATA = 'ERR_MULTIPLE_DATA';

    const prefix = `${this.constructor.name} - ${this.readPost.name}`;

    try {
      const postList = await this.postRepository.readPostList({ id: input.id });

      if (postList.length === 0) {
        throw new CustomGraphQLError('게시글 조회에 실패했습니다.', {
          extensions: {
            code: ERR_NO_DATA,
          },
        });
      } else if (postList.length > 1) {
        throw new CustomGraphQLError('선택된 게시글이 여러개입니다.', {
          extensions: {
            code: ERR_MULTIPLE_DATA,
          },
        });
      } else {
        return postList[0];
      }
    } catch (error) {
      // if (
      //   // 예측한 에러케이스인 경우, 위에서 잡은 에러를 그대로 던지기
      //   // 그 외 케이스인 경우 그대로 던지기
      //   Object.keys(this.ERROR_CODE.ERROR_CODE_READ_POST).includes(
      //     e.extensions?.code,
      //   )
      // ) {
      //   throw e;
      // } else {
      //   throw new CustomGraphQLError(e, {
      //     extensions: {
      //       code: 'UNEXPECTED_ERROR',
      //     },
      //   });
      // }

      if (error.extensions?.customFlag) {
        error.addBriefStacktraceToCode(prefix);
      }

      throw error;
    }
  }
}
