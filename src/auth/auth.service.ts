import { Injectable } from '@nestjs/common';
import { LoginInputDto } from './dtos/login.dto';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { CustomGraphQLError } from 'src/common/error';
import { JWT_PRIVATE_CLAIMS, JWT_TOKEN_PAYLOAD } from './types';
import { ConfigService } from '@nestjs/config';
import { LoggerStorage } from 'src/logger/logger-storage';
import { Wrapper } from 'src/logger/log.decorator';

@Injectable()
@Wrapper()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly als: LoggerStorage,
  ) {}

  /**
   * @description: 로그인
   * @param input
   * @returns
   */
  async login(input: LoginInputDto): Promise<string> {
    // 이 함수에서 발생하는 에러 케이스 정리
    const ERR_DELETED_USER = 'ERR_DELETED_USER';

    // 유저 정보 가져오기
    const user = await this.userService.readUserByOption({
      email: input.email,
    });

    // 해당 유저가 로그인할 수 있는지 확인하기 - 탈퇴 유저는 사용 불가
    if (user.deletedAt) {
      throw new CustomGraphQLError('탈퇴한 계정입니다.', {
        extensions: { code: ERR_DELETED_USER },
      });
    }

    // 토큰 생성하기 - payload 생성
    const payload: JWT_PRIVATE_CLAIMS = {
      uid: user.id,
      email: user.email,
    };

    // 토큰 생성하기
    // TODO 나중에 필요할 경우 refreshToken 생성
    const accessToken = await this.jwtService.signAsync(payload);

    return accessToken;
  }

  /**
   * @description 토큰 검증
   * @param token
   * @returns
   */
  async validateToken(token: string): Promise<JWT_PRIVATE_CLAIMS> {
    const ERR_EXPIRED_TOKEN = 'ERR_EXPIRED_TOKEN';
    const ERR_NOT_VALID_EMAIL = 'ERR_NOT_VALID_EMAIL';
    const ERR_NOT_VALID_USER_ID = 'ERR_NOT_VALID_USER_ID';
    const ERR_NOT_VALID_ISSUER = 'ERR_NOT_VALID_ISSUER';
    const ERR_NOT_VALID_TIME = 'ERR_NOT_VALID_TIME';
    const ERR_NOT_VALID_SUBJECT = 'ERR_NOT_VALID_SUBJECT';

    try {
      // 토큰 검증 - 토큰 만료
      const payload = this.jwtService.verify<JWT_TOKEN_PAYLOAD>(token);

      // 페이로드 필수값 확인 1. email이 없거나 email이 string이 아니거나 email이 email의 형태가 아닌 경우 에러처리
      if (
        !payload.email ||
        typeof payload.email !== 'string' ||
        !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(payload.email)
      ) {
        throw new CustomGraphQLError('이메일이 부정확합니다.', {
          extensions: {
            code: ERR_NOT_VALID_EMAIL,
          },
        });
      }

      // 페이로드 필수값 확인 2. 유저 아이디가 부정확한 경우
      if (!payload.uid || typeof payload.uid !== 'string') {
        throw new CustomGraphQLError('유저 아이디가 부정확합니다.', {
          extensions: {
            code: ERR_NOT_VALID_USER_ID,
          },
        });
      }

      // 페이로드 필수값 확인 3. 토큰 발급자가 부정확한 경우
      if (
        !payload.iss ||
        payload.iss !== this.configService.get('JWT_ISSUER')
      ) {
        throw new CustomGraphQLError('토큰의 발급자가 부정확합니다.', {
          extensions: {
            code: ERR_NOT_VALID_ISSUER,
          },
        });
      }

      // 페이로드 필수값 확인 4. 토큰의 발급 및 만료 시간이 부정확한 경우
      if (
        !payload.iat ||
        typeof payload.iat !== 'number' ||
        !payload.exp ||
        typeof payload.exp !== 'number'
      ) {
        throw new CustomGraphQLError(
          '토큰의 발급 및 만료 시간이 부정확합니다.',
          {
            extensions: {
              code: ERR_NOT_VALID_TIME,
            },
          },
        );
      }

      // 페이로드 필수값 확인 5. 토큰의 제목이 부정확한 경우
      if (
        !payload.sub ||
        payload.sub !== this.configService.get('JWT_SUBJECT')
      ) {
        throw new CustomGraphQLError('토큰의 제목이 부정확합니다.', {
          extensions: {
            code: ERR_NOT_VALID_SUBJECT,
          },
        });
      }

      return { uid: payload.uid, email: payload.email };
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        error = new CustomGraphQLError(
          '토큰이 만료되었습니다. 다시 로그인해주세요.',
          {
            extensions: {
              code: ERR_EXPIRED_TOKEN,
            },
          },
        );
      }

      throw error;
    }
  }
}
