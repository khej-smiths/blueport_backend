import {
  GraphQLError,
  GraphQLErrorExtensions,
  GraphQLErrorOptions,
} from 'graphql';

// 에러 객체
export class CustomGraphQLError extends GraphQLError {
  extensions: GraphQLErrorExtensions & { code: string; customFlag: true };

  constructor(message: string, options?: GraphQLErrorOptions) {
    super(message, {
      ...options,
      // customFlag: GraphQLError의 경우 직렬화의 과정을 거치기 때문에 CustomGraphQLError의 객체인지 여부를 'instanceof' 로 확인할 수 없다.
      // 그래서 확인을 위해 customFlag 를 추가해서 CustomGraphQLError 여부를 customFlag 필드로 확인
      // 맨 마지막의 GraphQLModule에서 formatError를 통해 처리될 때는 customFlag를 false로 처리하기위해 ?? 로 수정함
      extensions: {
        ...options?.extensions,
        customFlag: options?.extensions?.customFlag ?? true,
      },
    });
  }

  addBriefStacktraceToCode(briefStackTrace: string) {
    this.extensions.code = `[${briefStackTrace}] > ${this.extensions.code}`;
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
