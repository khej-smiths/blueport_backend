import { GraphQLError, GraphQLErrorExtensions } from 'graphql';

// 에러 메세지
export namespace ERR_MSG {
  const ERR_NO_USER = 'ERR_NO_USER';
}

// 에러 메세지 객체를 에러 코드 타입으로 전환
type ERROR_CODE = typeof ERR_MSG;

// 에러 객체
export class CustomGraphQLError extends GraphQLError {
  extensions: GraphQLErrorExtensions & { code: ERROR_CODE };
}

// 에러 처리
export const formatError = (
  error: GraphQLError,
  includeStackTrace: boolean,
) => {
  console.log(error, includeStackTrace);

  if (includeStackTrace === true) {
    delete error.extensions.stacktrace;
  }

  return error;
};

export default { formatError, ERR_MSG };
