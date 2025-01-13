import {
  GraphQLError,
  GraphQLErrorExtensions,
  GraphQLErrorOptions,
} from 'graphql';

// 에러 객체
export class CustomGraphQLError extends GraphQLError {
  extensions: GraphQLErrorExtensions & { code: string };
  constructor(message: string, options?: GraphQLErrorOptions) {
    super(message, options);
    // Object.setPrototypeOf(this, CustomGraphQLError.prototype);
  }
}

// 에러 처리
export const formatError = (
  error: GraphQLError,
  includeStackTrace: boolean,
) => {
  console.log('error format: ', error);

  if (includeStackTrace === false) {
    delete error.extensions.stacktrace;
  }

  return error;
};

// 게시글 조회 에러 케이스
export const ERROR_CODE_READ_POST = {
  NO_DATA: 'NO_DATA',
  MULTIPLE_DATA: 'MULTIPLE_DATA',
  UNEXPECTED_ERROR: 'UNEXPECTED_ERROR',
} as const;

export const ERROR_CODE_CREATE_POST = {
  UNEXPECTED_ERROR: 'UNEXPECTED_ERROR',
} as const;
