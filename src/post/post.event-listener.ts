import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PostRepository } from './post.repository';
import { CustomGraphQLError } from 'src/common/error';
import { CustomLogger } from 'src/logger/logger';

export const EVENT_INCREASE_VIEW_COUNT = 'EVENT_INCREASE_VIEW_COUNT';

/**
 * * README
 * Event로 받은 경우 비동기/동기 방식으로 구현한 Wrapper가 정상 동작을 하지 않아, 각 함수 내에서 로그 호출 후 구현필요
 */
@Injectable()
export class PostEventListener {
  constructor(private readonly postRepository: PostRepository) {}

  /**
   * @description 조회수 증가(이벤트)
   */
  @OnEvent(EVENT_INCREASE_VIEW_COUNT)
  private async increaseViewCount(
    postId: string,
    requestId: string,
  ): Promise<void> {
    // ===== 로거 셋팅 ===== //
    const logger = new CustomLogger(
      `(event - ${EVENT_INCREASE_VIEW_COUNT}) ${requestId}`,
    );
    const prefix = `${this.constructor.name} - ${this.increaseViewCount.name}`;

    // ===== input 로그 ===== //
    logger.customLog(
      { input: { postId, requestId } },
      {
        className: this.constructor.name,
        methodName: this.increaseViewCount.name,
      },
    );

    // ===== 조회수 증가 중 발생할 수 있는 에러케이스 ===== //
    const ERR_NO_UPDATE = 'ERR_NO_UPDATE'; // 업데이트 결과 없응ㅁ

    try {
      // ===== 조회수 증가 ===== //
      const updateResult = await this.postRepository.increaseViewCount(postId);

      // ===== 조회수 증가 처리 결과 로그===== //
      logger.customLog(
        { updateResult },
        {
          className: this.constructor.name,
          methodName: this.increaseViewCount.name,
        },
      );

      // ===== 업데이트에 성공한 row가 없는 경우 오류 ===== //
      if (updateResult.affected === 0) {
        throw new CustomGraphQLError('업데이트를 하지 못했습니다.', {
          extensions: {
            code: ERR_NO_UPDATE,
          },
        });
      }

      // ===== 조회수 증가가 성공한 경우 로그 ===== //
      logger.customLog(`success(increase viewCount for "${postId}")`, {
        className: this.constructor.name,
        methodName: this.increaseViewCount.name,
      });
    } catch (error) {
      // ===== 조회수 증가에 실패한 경우 에러처리 ===== //
      if (
        // ===== 커스텀으로 발생한 에러인 경우 에러 발생위치를 익스텐션에 추가 ===== //
        error.extensions?.customFlag
      ) {
        error.addBriefStacktraceToCode(prefix);
      }

      // ===== 에러 로그 ===== //
      logger.customError(error, {
        className: this.constructor.name,
        methodName: this.increaseViewCount.name,
      });

      // ===== 에러 그대로 리턴 ===== //
      throw error;
    } finally {
      // ===== 에러 유무에 상관없이 로거를 destroy해서 쌓아둔 로그를 요약해서 출력 ===== //
      logger.destroy();
    }
  }
}
