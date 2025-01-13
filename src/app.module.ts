import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';
import { CustomGraphQLError } from './common/error';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerMiddleware } from './logger/logger.middleware';
import { LoggerModule } from './logger/logger.module';
import Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { AuthModule } from './auth/auth.module';
import { Post } from './post/post.entity';

@Module({
  imports: [
    // 환경변수 설정 모듈
    ConfigModule.forRoot({
      isGlobal: true, // 해당 모듈을 전역에서 접근할 수 있도록 isGlobal: true로 설정
      envFilePath: '.env.dev', // 환경변수 파일
      // 환경변수 셋팅 확인
      validationSchema: Joi.object({
        // 환경
        NODE_ENV: Joi.string().valid('dev', 'prod', 'test').required(),
        // 로그 stacktrace 포함 여부
        INCLUDE_STACKTRACE: Joi.boolean().required(),
        // mysql
        MYSQL_HOST: Joi.string().required(),
        MYSQL_PORT: Joi.number().required(),
        MYSQL_USERNAME: Joi.string().required(),
        MYSQL_PASSWORD: Joi.string().required(),
        MYSQL_DATABASE: Joi.string().required(),
        // jwt
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRES_IN: Joi.string().required(), // 만료시간
        JWT_ISSUER: Joi.string().required(), // 토큰 발급자
        JWT_SUBJECT: Joi.string().required(), // 토큰 발급자
      }),
    }),
    // GraphQL 설정 모듈
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule], // 모듈을 다른 모듈에서 사용할 수 있도록 가져오는 역할(모듈간의 의존성 관계를 설정하는데 사용)
      inject: [ConfigService], // 의존성 주입에서 특정 클래스 또는 서비스를 명시적으로 주입받고자 할 때 사용하는 배열. 주로 팩토리 함수 또는 커스텀 프로바이더에서 사용
      useFactory: async (configService: ConfigService) => {
        return {
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'), // 스키마 파일 생성 방식 선언
          formatError: (error: any) => {
            // 'INCLUDE_STACKTRACE' 가 true인 경우는 STACKTRACE를 남기도록 셋팅
            const includeStackTrace =
              configService.get<boolean>('INCLUDE_STACKTRACE') ?? false;

            // 에러 로그
            // TODO 만들어둔 custom logger 사용하기
            console.log('error format: ', error);

            // TODO instanceof, constructor.name 으로도 다 잡히지 않아서 에러 해결 방식 찾아봐야한다.
            if (!(error instanceof CustomGraphQLError)) {
              return new CustomGraphQLError(error.message, {
                extensions: {
                  code: 'UNEXPECTED_ERR',
                },
              });
            }

            if (includeStackTrace === false) {
              delete error.extensions.stacktrace;
            }

            return error;
          },
        };
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('MYSQL_HOST'),
        port: +configService.get('MYSQL_PORT'),
        username: configService.get('MYSQL_USERNAME'),
        password: configService.get('MYSQL_PASSWORD'),
        database: configService.get('MYSQL_DATABASE'),
        entities: [User, Post],
        synchronize: true,
      }),
    }),
    AuthModule,
    PostModule,
    UserModule,
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
