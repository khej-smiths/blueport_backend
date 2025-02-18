import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Reflector } from '@nestjs/core';
import { UserService } from 'src/user/user.service';
import { AccessRoleType } from 'src/auth/auth.decorator';
import { CustomGraphQLError } from 'src/common/error';
import { JWT_PRIVATE_CLAIMS } from './types';
import { Wrapper } from 'src/logger/log.decorator';
import { LoggerStorage } from 'src/logger/logger-storage';

@Injectable()
@Wrapper()
export class GlobalGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly reflector: Reflector,
    // als의 경우 실제 클래스에서 직접 사용하지 않지만, Wrapper 데코레이터에서 사용하고 있기 때문에 호출함
    private readonly als: LoggerStorage,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 에러 케이스
    const ERR_NO_TOKEN = 'ERR_NO_TOKEN'; // 토큰이 없는 경우
    const ERR_NOT_VALID_TOKEN = 'ERR_NOT_VALID_TOKEN'; // 부적절한 토큰인 경우

    // 컨텍스트 가져오기
    const gqlContext = GqlExecutionContext.create(context).getContext(); // * 일반 Http Context 를 graphQL Context 로 변경

    // 토큰 가져오기
    const accessToken = gqlContext['access_token'];

    // 토큰 해독 후 그 결과값을 할당할 변순 선언하기
    let validationResult!: JWT_PRIVATE_CLAIMS;

    // 토큰이 있는 경우 유효한 토큰인지 확인하기
    if (accessToken) {
      validationResult = await this.authService.validateToken(accessToken);

      // 토큰 검증 후 이메일과 uid가 없는 경우 에러를 리턴
      if (!validationResult.email || !validationResult.uid) {
        throw new CustomGraphQLError('유효하지 않은 로그인입니다.', {
          extensions: {
            code: ERR_NOT_VALID_TOKEN,
          },
        });
      }
    }

    // 권한 확인하기(호출한 API에 AccessRole 데코레이터가 없는 경우 모두가 호출할 수 있는 'PUBLIC' API이다)
    let accessRole =
      this.reflector.get<AccessRoleType>('AccessRole', context.getHandler()) ||
      'PUBLIC';

    if (accessRole === 'PUBLIC') {
      // 'PUBLIC' API인 경우 모두가 사용 가능
      return true;
    } else {
      // 'PUBLIC' API가 아닌 경우 유저를 가져와서 확인해야함
      if (!accessToken) {
        throw new CustomGraphQLError('로그인이 필요한 서비스입니다.', {
          extensions: {
            code: ERR_NO_TOKEN,
          },
        });
      }

      // 유저 정보 가져오기
      const user = this.userService.readUserByOption({
        email: validationResult.email,
        userId: validationResult.uid,
      });

      // 가져온 유저 정보를 컨텍스트에 담기
      gqlContext['user'] = user;

      // 다음 로직 진행
      return true;
    }
  }
}
