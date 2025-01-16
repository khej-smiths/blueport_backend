import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

/**
 * TODO 여기 셋팅방법 다시 확인 필요
 * 참고자료
 * https://velog.io/@tmddud73/Nest.js-6-JWT
 *
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    console.log('JwtStrategy constructor');
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      ignoreExpiration: true, // 만료 여부 확인 - false인 경우 알아서 처리
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true, // reqeust에 직접 접근
    });
  }

  /**
   * @description JWT 토큰이 유효할 때, 호출되는 메서드로 추가 로직을 넣어 유효성을 추가 검증한다
   * @param payload
   * @returns
   */
  async validate(payload: any) {
    console.log('JwtStrategy validate', payload);

    return payload;
  }
}
