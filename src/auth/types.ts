// private claims
export type JWT_PRIVATE_CLAIMS = Record<
  'email', // 유저의 이메일
  string
> &
  Record<
    'uid', // 유저의 아이디
    number
  >;

// 생성된 토큰의 payload
export type JWT_TOKEN_PAYLOAD = {
  exp: number; // 토큰 만료 시간
  iat: number; // 토큰 생성 시간
  iss: string; // 토큰의 발급자
  sub: string; // 토큰의 제목
} & JWT_PRIVATE_CLAIMS;
