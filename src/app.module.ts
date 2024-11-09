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
      imports: [ConfigModule],
      inject: [ConfigService],
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
