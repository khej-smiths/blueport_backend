import { InputType, PartialType, PickType } from '@nestjs/graphql';
import { UserInputType } from '../user.entity';

@InputType()
export class UpdateUserInputDto extends PartialType(
  PickType(UserInputType, ['name', 'password']),
) {}
