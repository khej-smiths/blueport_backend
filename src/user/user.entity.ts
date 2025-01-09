import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CommonEntity } from 'src/common/common.entity';
import { Column, Entity } from 'typeorm';

@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
abstract class IUser extends CommonEntity {
  @Field(() => String, { description: '유저의 이름' })
  @Column({ type: 'varchar', length: 256, comment: '유저의 이름' })
  name: string;
}

@ObjectType()
@Entity()
export class User extends IUser {}

@InputType()
export class UserInputType extends IUser {}
