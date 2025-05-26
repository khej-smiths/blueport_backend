import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { User } from './user.entity';
import { UserService } from './user.service';
import { input } from 'src/common/consts';
import { CreateUserInputDto } from './dtos/create-user.dto';
import {
  AccessRole,
  AuthUser,
  RequiredRelationList,
} from 'src/auth/auth.decorator';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User, { description: '유저 생성' })
  async createUser(@Args(input) input: CreateUserInputDto): Promise<User> {
    return await this.userService.createUser(input);
  }

  @Query(() => User, {
    description: '유저 정보 가져오기(현재는 본인의 정보만)',
  })
  @AccessRole('USER')
  @RequiredRelationList(['blog'])
  async readUser(@AuthUser() user: User) {
    return user;
  }

  // TODO updateUser
}
