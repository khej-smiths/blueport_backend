import { Injectable } from '@nestjs/common';
import { Post, PostInputType } from './post.model';
import { ReadPostInputDto } from './dtos/read-post.dto';
import { PostRepository } from './post.repository';
import { CustomGraphQLError, ERROR_CODE_READ_POST } from 'src/common/error';

@Injectable()
export class PostService {
  private readonly ERROR_CODE: Record<string, typeof ERROR_CODE_READ_POST>;

  constructor(private readonly postRepository: PostRepository) {
    this.ERROR_CODE = {
      ERROR_CODE_READ_POST,
    };
  }

  async readPost(input: ReadPostInputDto): Promise<Post> {
    try {
      const postList = await this.postRepository.readPostList({ id: input.id });

      if (postList.length === 0) {
        throw new CustomGraphQLError('게시글 조회에 실패했습니다.', {
          extensions: {
            code: this.ERROR_CODE.ERROR_CODE_READ_POST.NO_DATA,
          },
        });
      } else if (postList.length > 1) {
        throw new CustomGraphQLError('선택된 게시글이 여러개입니다.', {
          extensions: {
            code: this.ERROR_CODE.ERROR_CODE_READ_POST.MULTIPLE_DATA,
          },
        });
      } else {
        return postList[0];
      }
    } catch (e) {
      if (
        // 예측한 에러케이스인 경우, 위에서 잡은 에러를 그대로 던지기
        // 그 외 케이스인 경우 그대로 던지기
        Object.keys(this.ERROR_CODE.ERROR_CODE_READ_POST).includes(
          e.extensions?.code,
        )
      ) {
        throw e;
      } else {
        throw new CustomGraphQLError(e, {
          extensions: {
            code: 'UNEXPECTED_ERROR',
          },
        });
      }
    }
  }

  async createPost(input: PostInputType): Promise<Post> {
    return input;
  }
}
