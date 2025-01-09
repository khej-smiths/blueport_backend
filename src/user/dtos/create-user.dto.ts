import { InputType, PickType } from '@nestjs/graphql';
import { UserInputType } from '../user.entity';

@InputType()
export class CreateUserInputDto extends PickType(UserInputType, [
  'name',
  'email',
]) {}
