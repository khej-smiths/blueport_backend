import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CommonEntity } from 'src/common/common.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  Relation,
  Unique,
} from 'typeorm';

@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
abstract class IBlog extends CommonEntity {
  @Field(() => String, { description: '블로그 이름' })
  @Column({ type: 'varchar', length: 256, comment: '블로그 이름' })
  name: string;

  @Field(() => String, { description: '도메인' })
  @Column({
    type: 'varchar',
    length: 256,
    comment: '도메인',
  })
  domain: string;

  @Field(() => String, { description: '프로필 사진', nullable: true })
  @Column({
    type: 'varchar',
    length: 256,
    comment: '프로필 사진',
    nullable: true,
    name: 'profile_photo',
  })
  profilePhoto?: string;

  @Field(() => String, { description: '자기소개', nullable: true })
  @Column({
    type: 'varchar',
    length: 256,
    comment: '자기소개',
    nullable: true,
  })
  introduction?: string;

  @Field(() => String, { description: '기술 스택', nullable: true })
  @Column({
    type: 'json',
    comment: '기술 스택',
    nullable: true,
  })
  skills?: Array<string>;

  @Column({ type: 'uuid', name: 'owner_id', comment: '블로그 주인의 id' })
  ownerId: string;

  @OneToOne(() => User, (user) => user.blog)
  @JoinColumn({ name: 'owner_id' })
  @Field(() => User, { description: '블로그 주인 전체 정보' })
  owner: Relation<User>;
}

@ObjectType()
@Entity('blog')
@Unique('unique_domain_for_blog', ['domain']) // email을 unique키로 설정했고 중복인 경우 create에서 에러 메세지를 따로 처리하고 있다
export class Blog extends IBlog {}

@InputType()
export class BlogInputType extends IBlog {}
