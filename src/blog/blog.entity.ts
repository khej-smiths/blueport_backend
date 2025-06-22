import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  ArrayMaxSize,
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
} from 'class-validator';
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
  @Column({ type: 'varchar', length: 255, comment: '블로그 이름' })
  @IsString()
  name: string;

  @Field(() => String, { description: '도메인, 50자 내외' })
  @Column({
    type: 'varchar',
    length: 255,
    comment: '도메인',
  })
  @IsString()
  domain: string;

  @Field(() => String, { description: '인사말' })
  @Column({
    type: 'varchar',
    length: 255,
    comment: '인사말',
  })
  @IsString()
  greeting: string;

  @Field(() => String, { description: '자기소개' })
  @Column({
    type: 'varchar',
    length: 255,
    comment: '자기소개',
  })
  @IsString()
  introduction: string;

  /////////////////////////////
  // ===== 옵셔널 필드 ===== //
  /////////////////////////////

  @Field(() => String, { description: '프로필 사진', nullable: true })
  @Column({
    type: 'varchar',
    length: 255,
    comment: '프로필 사진',
    name: 'photo',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  photo?: string;

  @Field(() => [String], {
    description: '기술 스택, 100개 제한',
    nullable: true,
  })
  @Column({
    type: 'json',
    comment: '기술 스택',
    nullable: true,
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(100) // 배열 최대길이
  @IsOptional()
  skills?: Array<string>;

  @Field(() => String, { description: '연락용 이메일', nullable: true })
  @Column({
    type: 'varchar',
    length: 255,
    comment: '이메일',
    nullable: true,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @Field(() => String, { description: 'github 링크', nullable: true })
  @Column({
    type: 'varchar',
    length: 255,
    comment: 'github',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  github?: string;

  /////////////////////////////////
  // ===== 관계표시용 필드 ===== //
  /////////////////////////////////
  @Column({
    type: 'uuid',
    name: 'owner_id',
    comment: '블로그 주인의 id',
    unique: true,
  })
  @Field(() => String, { description: '블로그 주인의 id' })
  ownerId: string;

  // 블로그 주인 전체 정보
  @OneToOne(() => User, (user) => user.blog)
  @JoinColumn({ name: 'owner_id' })
  owner: Relation<User>;
}

@ObjectType()
@Entity('blog')
@Unique('unique_domain_for_blog', ['domain']) // domain을 unique키로 설정했고 중복인 경우 create에서 에러 메세지를 따로 처리하고 있다
export class Blog extends IBlog {
  // graphql에서만 사용
  @Field(() => String, { description: '연결된 이력서의 Id', nullable: true })
  resumeId?: string;
}

@InputType()
export class BlogInputType extends IBlog {}
