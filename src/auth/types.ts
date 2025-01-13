// private claims
export type JWT_PRIVATE_CLAIMS = Record<
  'email', // 유저의 이메일
  string
> &
  Record<
    'uid', // 유저의 아이디
    number
  >;
