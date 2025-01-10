import { Resolver, Query, Args } from '@nestjs/graphql';
import { LoginInputDto } from './dtos/login.dto';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}
  @Query(() => String)
  async login(@Args('input') input: LoginInputDto): Promise<string> {
    return await this.authService.login(input);
  }
}
