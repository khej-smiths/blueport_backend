import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        () => {
          return { INCLUDE_STACKTRACE: true };
        },
      ],
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule], // 모듈을 다른 모듈에서 사용할 수 있도록 가져오는 역할(모듈간의 의존성 관계를 설정하는데 사용)
      inject: [ConfigService], // 의존성 주입에서 특정 클래스 또는 서비스를 명시적으로 주입받고자 할 때 사용하는 배열. 주로 팩토리 함수 또는 커스텀 프로바이더에서 사용
      useFactory: async (configService: ConfigService) => {
        console.log(configService);
        return {
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
          formatError: (error: GraphQLError) => {
            const includeStackTrace =
              configService.get<boolean>('INCLUDE_STACKTRACE') ?? false;
            return formatError(error, includeStackTrace);
          },
        };
      },
    }),
    PostModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
