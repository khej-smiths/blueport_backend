import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsOptional, Matches } from 'class-validator';
import { CommonEntity } from 'src/common/common.entity';
import { Column, Entity } from 'typeorm';

@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
abstract class IProject {
  @Column({ type: 'int', unsigned: true, comment: '정렬 순서' })
  @Field(() => Int, { description: '정렬 순서' })
  order: number;

  @Column({
    type: 'varchar',
    length: 255,
    comment: '프로젝트 명',
  })
  @Field(() => String, { description: '프로젝트 명' })
  name: string;

  @Column({ type: 'int', unsigned: true, comment: '참여 인원', nullable: true })
  @Field(() => Int, { description: '참여 인원', nullable: true })
  personnel?: number;

  @Column({
    type: 'json',
    comment: '기술 스택',
    nullable: true,
    name: 'skill_list',
  })
  @Field(() => [String], { description: '기술 스택', nullable: true })
  skillList?: Array<string>;

  @Column({
    type: 'varchar',
    length: 255,
    comment: '설명',
    nullable: true,
  })
  @Field(() => String, { description: '설명', nullable: true })
  description?: string;

  @Column({
    type: 'varchar',
    length: 255,
    comment: '시작날짜. 날짜의 형태: yyyy.MM',
    name: 'start_at',
  })
  @Field(() => String, { description: '시작날짜. 날짜의 형태: yyyy.MM' })
  @Matches(/^\d{4}\.(0[1-9]|1[0-2])$/, {
    message: ' must be in the format yyyy.MM',
  })
  startAt: string;

  @Column({
    type: 'varchar',
    length: 255,
    comment: '끝난 날짜. 날짜의 형태: yyyy.MM',
    nullable: true,
    name: 'end_at',
  })
  @Field(() => String, {
    description: '끝난 날짜. 없는 경우 현재 진행중. 날짜의 형태: yyyy.MM',
    nullable: true,
  })
  @IsOptional()
  @Matches(/^\d{4}\.(0[1-9]|1[0-2])$/, {
    message: ' must be in the format yyyy.MM',
  })
  endAt?: string;
}

@ObjectType()
export class Project extends IProject {}

@InputType()
export class ProjectInputType extends IProject {}
