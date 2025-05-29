import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { GqlExecutionContext } from '@nestjs/graphql';
import { tap, catchError } from 'rxjs/operators';
import { LoggerStorage } from './logger-storage';
import { CustomLogger } from './logger';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private readonly als: LoggerStorage) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // NewAuthGuard에서 셋팅된 이메일 값을 가져오기
    const gqlContext = GqlExecutionContext.create(context).getContext();
    const logger: CustomLogger = this.als.getStore()!.customLogger;
    const email = gqlContext.user?.email;
    if (email) logger.setEmail(email);

    return next.handle().pipe(
      tap(() => {
        logger.destroy();
      }),
      catchError((error) => {
        // ================================================ //
        // 에러가 발생한 경우,
        // 1. 커스텀 에러 로그를 남기고
        // 2. 에러 이전에 발생했던 로그까지 전부 출력하고
        // 3. 기존 에러에 requestId를 추가하여
        // 로그만으로도 실제 함수의 IO 및 로그를 추적 가능
        // ================================================ //

        // ===== 커스텀 에러 로그 찍기 ===== //
        logger.customError(
          { error },
          { className: 'LogInterceptor', methodName: 'intercept - catchError' },
        );
        // ===== 기존에 남긴 로그 전체 남기기===== //
        logger.destroy();
        // ===== 에러에 requestId 적용하기 ===== //
        error.applyRequestId(logger.getRequestId());
        throw error;
      }),
    );
  }
}
