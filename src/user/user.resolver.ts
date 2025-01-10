import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { User } from './user.entity';
import { UserService } from './user.service';
import { input } from 'src/common/consts';
import { CreateUserInputDto } from './dtos/create-user.dto';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  async createUser(@Args(input) input: CreateUserInputDto): Promise<User> {
    return await this.userService.createUser(input);
  }
}
