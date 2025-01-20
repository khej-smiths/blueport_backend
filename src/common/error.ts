import {
  GraphQLError,
  GraphQLErrorExtensions,
  GraphQLErrorOptions,
} from 'graphql';
import { DateTime } from 'luxon';

// 에러 객체
export class CustomGraphQLError extends GraphQLError {
  extensions: GraphQLErrorExtensions & {
    code: string;
    customFlag: true;
  };

  constructor(message: string, options?: GraphQLErrorOptions) {
    /**
     * [luxon]
     * luxon의 경우 별도의 타임존을 셋팅하지 않으면 로컬 타임존에 맞춰서 셋팅된다.
     * 예시: 'yyyy/MM/dd HH:mm:u (ZZZZ) > 2025/01/16 00:54:875 (UTC+9)
     */
    const now = DateTime.now()
      .setZone('utc+9')
      .toFormat('yyyy/MM/dd HH:mm:u (ZZZZ)');
    super(`${message} - ${now}`, {
      ...options,
      // customFlag: GraphQLError의 경우 직렬화의 과정을 거치기 때문에 CustomGraphQLError의 객체인지 여부를 'instanceof' 로 확인할 수 없다.
      // 그래서 확인을 위해 customFlag 를 추가해서 CustomGraphQLError 여부를 customFlag 필드로 확인
      // 맨 마지막의 GraphQLModule에서 formatError를 통해 처리될 때는 customFlag를 false로 처리하기위해 ?? 로 수정함
      extensions: {
        ...options?.extensions,
        code: `${options?.extensions?.code} - ${now}`,
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

export const ERROR_CODE_CREATE_POST = {
  UNEXPECTED_ERROR: 'UNEXPECTED_ERROR',
} as const;
