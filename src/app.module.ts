import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';
import { formatError } from './common/error';
import { GraphQLError } from 'graphql';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerMiddleware } from './logger/logger.middleware';
import { LoggerModule } from './logger/logger.module';
import Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';

@Module({
  imports: [
    // 환경변수 설정 모듈
    ConfigModule.forRoot({
      isGlobal: true, // 해당 모듈을 전역에서 접근할 수 있도록 isGlobal: true로 설정
      envFilePath: '.env.dev', // 환경변수 파일
      // 환경변수 셋팅 확인
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod', 'test').required(),
        INCLUDE_STACKTRACE: Joi.boolean().required(),
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
          formatError: (error: GraphQLError) => {
            // 'INCLUDE_STACKTRACE' 가 true인 경우는 STACKTRACE를 남기도록 셋팅
            const includeStackTrace =
              configService.get<boolean>('INCLUDE_STACKTRACE') ?? false;
            return formatError(error, includeStackTrace);
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
        entities: [User],
        synchronize: true,
      }),
    }),
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
