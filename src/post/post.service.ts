import { Injectable } from '@nestjs/common';
import { Post } from './post.entity';
import { ReadPostInputDto } from './dtos/read-post.dto';
import { PostRepository } from './post.repository';
import { CustomGraphQLError } from 'src/common/error';
import { CreatePostInputDto } from './dtos/create-post.dto';
import { User } from 'src/user/user.entity';
import { ReadPostListInputDto } from './dtos/read-post-list.dto';
import { UpdatePostInputDto } from './dtos/update-post.dto';
import { IOLogger } from 'src/logger/log.decorator';
import { DeletePostInputDto } from './dtos/delete-post.dto';

@Injectable()
@IOLogger()
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

  /**
   * @description 게시글 조회하기
   * @param input
   * @returns
   */
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
      if (error.extensions?.customFlag) {
        error.addBriefStacktraceToCode(prefix);
      }

      throw error;
    }
  }

  async readPostList(input: ReadPostListInputDto): Promise<Array<Post>> {
    const postList = await this.postRepository.readPostList({
      skip: input.limit * (input.pageNumber - 1),
      take: input.limit,
    });

    return postList;
  }

  async updatePost(input: UpdatePostInputDto, writer: User): Promise<Post> {
    const ERR_NO_UPDATE = 'ERR_NO_UPDATE';

    const prefix = `${this.constructor.name} - ${this.updatePost.name}`;

    try {
      // 수정 가능한 게시글인지 확인하기
      const post = await this.getEditablePost({
        postId: input.id,
        editorId: writer.id,
      });

      // 업데이트하기
      const updateResult = await this.postRepository.updatePost(input, writer);

      // 업데이트에 성공한 row가 없는 경우 오류
      if (updateResult.affected === 0) {
        throw new CustomGraphQLError('업데이트를 하지 못했습니다.', {
          extensions: {
            code: ERR_NO_UPDATE,
          },
        });
      }

      return {
        ...post,
        ...(input.content && { content: input.content }),
        ...(input.title && { title: input.title }),
      };
    } catch (error) {
      if (error.extensions?.customFlag) {
        error.addBriefStacktraceToCode(prefix);
      }

      throw error;
    }
  }

  /**
   * @description 게시글 삭제하기
   * @param input
   * @param writer
   * @returns
   */
  async deletePost(input: DeletePostInputDto, writer: User): Promise<boolean> {
    const prefix = `${this.constructor.name} - ${this.deletePost.name}`;

    const ERR_FAILED = 'ERR_FAILED';

    try {
      // 삭제 가능한 게시글인지 확인하기
      await this.getEditablePost({
        postId: input.id,
        editorId: writer.id,
      });

      // 게시글 삭제하기
      const [deleteResult, queryRunner] = await this.postRepository.deletePost(
        input,
        writer,
      );

      // 게시글 삭제 결과가 0인 경우 삭제된 게시글이 없음
      if (!deleteResult.affected || deleteResult.affected === 0) {
        throw new CustomGraphQLError(
          '게시글을 삭제하지 못했습니다. 다시 시도해주세요.',
          {
            extensions: {
              code: ERR_FAILED,
            },
          },
        );
      }

      // TODO 삭제된 게시글이 여러개인 경우 롤백하기 > 정상 동작여부 확인 필요
      if (deleteResult.affected > 1) {
        await queryRunner.rollbackTransaction();
      } else {
        await queryRunner.commitTransaction();
      }

      return true;
    } catch (error) {
      if (error.extensions?.customFlag) {
        error.addBriefStacktraceToCode(prefix);
      }

      throw error;
    }
  }

  /**
   * @description 게시글 id, 게시글 수정을 요청한 유저의 id를 유효하게 수정할 수 있는 게시글인지 확인한 후 수정할 게시글 객체를 반환
   */
  private async getEditablePost(input: {
    postId: string;
    editorId: string;
  }): Promise<Post> {
    const ERR_NO_DATA = 'ERR_NO_DATA';
    const ERR_MULTIPLE_DATA = 'ERR_MULTIPLE_DATA';
    const ERR_NOT_WRITER = 'ERR_NOT_WRITER';

    const prefix = `${this.constructor.name} - ${this.getEditablePost.name}`;

    try {
      // 게시글을 업데이트하기 위한 조건 확인하기 위해 게시글을 우선 조회하기
      const postList = await this.postRepository.readPostList({
        id: input.postId,
      });

      // 조회된 게시글이 없는 경우 오류처리
      if (!postList || postList.length === 0) {
        throw new CustomGraphQLError('게시글을 조회할 수 없습니다.', {
          extensions: {
            code: ERR_NO_DATA,
          },
        });
      }

      // 조회된 게시글이 여러개인 경우 오류 처리
      if (postList && postList.length > 1) {
        throw new CustomGraphQLError('선택된 게시글이 여러개입니다.', {
          extensions: {
            code: ERR_MULTIPLE_DATA,
          },
        });
      }

      // 조회된 게시글은 1개이기 때문에 postList > post로 변수 변경
      const post = postList[0];

      // 게시글의 작성자는 본인이어야한다
      if (post.writerId !== input.editorId) {
        throw new CustomGraphQLError(
          '본인이 작성한 게시글만 업데이트/삭제할 수 있습니다.',
          {
            extensions: {
              code: ERR_NOT_WRITER,
            },
          },
        );
      }

      return post;
    } catch (error) {
      if (error.extensions?.customFlag) {
        error.addBriefStacktraceToCode(prefix);
      }

      throw error;
    }
  }
}
