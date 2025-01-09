import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { User } from './user.entity';
import { UserService } from './user.service';
import { Post } from 'src/post/post.entity';
import { CreatePostInputDto } from 'src/post/dtos/create-post.dto';
import { input } from 'src/common/consts';
import { ReadPostListInputDto } from 'src/post/dtos/read-post-list.dto';
import { CreateUserInputDto } from './dtos/create-user.dto';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  async createUser(@Args(input) input: CreateUserInputDto): Promise<User> {
    return await this.userService.createUser(input);
  }
}
