import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Reflector } from '@nestjs/core';
import { UserService } from 'src/user/user.service';
import { AccessRoleType } from 'src/auth/auth.decorator';

@Injectable()
export class GlobalGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly reflector: Reflector,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('GlobalGuard');

    const ERR_NO_TOKEN = 'ERR_NO_TOKEN';

    const gqlContext = GqlExecutionContext.create(context).getContext(); // * 일반 Http Context 를 graphQL Context 로 변경

    const accessToken = gqlContext['access_token'];

    let validationResult!: { email: string; uid: number };

    // 토큰이 있는 경우 토큰을 확인하기
    if (accessToken) {
      validationResult = this.authService.validateToken(accessToken);

      // 토큰 검증 후 이메일과 uid가 없는 경우 false 리턴
      if (!validationResult.email || validationResult.uid) {
        return false;
      }
    }

    // 권한 확인하기
    let accessRole =
      this.reflector.get<AccessRoleType>('AccessRole', context.getHandler()) ||
      'PUBLIC';

    if (accessRole === 'PUBLIC') {
      // 'PUBLIC' API인 경우 모두가 사용 가능
      return true;
    } else {
      // 'PUBLIC' API가 아닌 경우 유저를 가져와서 확인해야함

      // PUBLIC API가 아닌데 email, uid 가 없는 경우 에러
      if (!validationResult.email || validationResult.uid) {
        return false;
      }

      const user = this.userService.readUserByOption({
        email: validationResult.email,
        userId: validationResult.uid,
      });

      gqlContext['user'] = user;
      return true;
    }
  }
}
