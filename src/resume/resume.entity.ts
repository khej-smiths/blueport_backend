import { Field, Float, InputType, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsOptional, Matches, ValidateNested } from 'class-validator';
import { CommonEntity } from 'src/common/common.entity';
import { Column, Entity } from 'typeorm';

@ObjectType()
@InputType('EducationInputType')
class Education {
  @Field(() => String, { description: '학교명' })
  name: string;

  @Field(() => String, { description: '전공', nullable: true })
  major?: string;

  @Field(() => Float, { description: '학점', nullable: true })
  grade?: number;

  @Field(() => String, { description: '기타', nullable: true })
  description?: string;

  @Field(() => String, { description: '시작날짜. 날짜의 형태: yyyy.MM' })
  @Matches(/^\d{4}\.(0[1-9]|1[0-2])$/, {
    message: ' must be in the format yyyy.MM',
  })
  startAt: string;

  // TODO 값이 있는 경우에는 startAt과 같거나 뒤에 있어야한다.
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

@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
abstract class IResume extends CommonEntity {
  // 학력
  @Field(() => [Education], { nullable: true, description: '학력' })
  @ValidateNested({ each: true })
  @Type(() => Education)
  @Column({ type: 'json', nullable: true })
  educationList?: Array<Education>;
  // 경력
  // 프로젝트
  // 포트폴리오
}

@ObjectType()
@Entity('resume')
export class Resume extends IResume {}

@InputType()
export class ResumeInputType extends IResume {}
