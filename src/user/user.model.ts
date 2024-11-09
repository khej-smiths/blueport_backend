import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
abstract class IUser {
  @Field(() => Int, { description: '유저의 id' })
  id: number;

  @Field(() => String, { description: '유저의 이름' })
  name: string;
}

@ObjectType()
export class User extends IUser {}

@InputType()
export class UserInputType extends IUser {}
