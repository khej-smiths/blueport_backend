import { Resolver, Query, Args } from '@nestjs/graphql';
import { LoginInputDto } from './dtos/login.dto';

@Resolver()
export class AuthResolver {
  @Query(() => String)
  async login(@Args('input') input: LoginInputDto): Promise<string> {
    return 'token';
  }
}
