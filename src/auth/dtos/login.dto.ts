import { InputType, PickType } from '@nestjs/graphql';
import { UserInputType } from 'src/user/user.entity';

@InputType()
export class LoginInputDto extends PickType(UserInputType, [
  'email',
  'password',
]) {}
