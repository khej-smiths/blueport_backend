import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { UserResolver } from './user.resolver';
import { UserDataLoaderService } from './user.data-loader';

@Module({
  providers: [UserService, UserRepository, UserResolver, UserDataLoaderService],
  exports: [UserService, UserDataLoaderService],
})
export class UserModule {}
