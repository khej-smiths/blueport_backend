import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CommonEntity } from 'src/common/common.entity';
import { Column, Entity, Unique } from 'typeorm';

@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
abstract class IUser extends CommonEntity {
  @Field(() => String, { description: '유저의 이름' })
  @Column({ type: 'varchar', length: 256, comment: '유저의 이름' })
  name: string;

  @Field(() => String, { description: '유저의 이메일' })
  @Column({
    type: 'varchar',
    length: 256,
    comment: '유저의 이메일',
  })
  email: string;
}

@ObjectType()
@Entity('user')
@Unique('unique_email_for_user', ['email']) // email을 unique키로 설정했고 중복인 경우 create에서 에러 메세지를 따로 처리하고 있다
export class User extends IUser {}

@InputType()
export class UserInputType extends IUser {}
