import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { GlobalGuard } from './auth.guard';

@Module({
  imports: [
    UserModule,
    // jwt 설정
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN'),
          issuer: configService.get('JWT_ISSUER'),
          subject: configService.get('JWT_SUBJECT'),
        },
      }),
    }),
  ],
  providers: [
    AuthResolver,
    AuthService,
    { provide: APP_GUARD, useClass: GlobalGuard },
  ],
})
export class AuthModule {}
