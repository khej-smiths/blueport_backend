import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { GqlExecutionContext } from '@nestjs/graphql';
import { tap } from 'rxjs/operators';
import { LoggerStorage } from './logger-storage';
import { CustomLogger } from './logger';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  // TODO requestId가 변경되지 않도록 로직 수정 필요
  constructor(private readonly als: LoggerStorage) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // NewAuthGuard에서 셋팅된 이메일 값을 가져오기
    const gqlContext = GqlExecutionContext.create(context).getContext();
    const logger: CustomLogger = this.als.getStore()!.customLogger;
    const email = gqlContext.email;
    if (email) logger.setEmail(email);
    return next.handle().pipe(
      tap(() => {
        logger.destroy();
      }),
    );
  }
}
