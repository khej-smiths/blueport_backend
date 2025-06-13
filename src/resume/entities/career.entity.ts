import { CommonEntity } from 'src/common/common.entity';
import { Column, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm';
import { Resume } from './resume.entity';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsOptional, Matches } from 'class-validator';

@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
abstract class ICareer extends CommonEntity {
  @Column({ type: 'int', unsigned: true, comment: '정렬 순서' })
  @Field(() => Int, { description: '정렬 순서' })
  order: number;

  @Column({
    type: 'varchar',
    length: 255,
    comment: '회사',
    nullable: true,
  })
  @Field(() => String, { description: '회사', nullable: true })
  company?: string;

  @Column({
    type: 'varchar',
    length: 255,
    comment: '부서',
    nullable: true,
  })
  @Field(() => String, { description: '부서', nullable: true })
  department?: string;

  @Column({
    type: 'varchar',
    length: 255,
    comment: '직급',
    nullable: true,
  })
  @Field(() => String, { description: '직급', nullable: true })
  position?: string;

  @Column({
    type: 'varchar',
    length: 255,
    comment: '업무 내용',
    nullable: true,
  })
  @Field(() => String, { description: '업무 내용', nullable: true })
  description?: string;

  @Column({
    type: 'varchar',
    length: 255,
    comment: '시작날짜. 날짜의 형태: yyyy.MM',
  })
  @Field(() => String, { description: '시작날짜. 날짜의 형태: yyyy.MM' })
  @Matches(/^\d{4}\.(0[1-9]|1[0-2])$/, {
    message: ' must be in the format yyyy.MM',
  })
  startAt: string;

  // TODO 값이 있는 경우에는 startAt과 같거나 뒤에 있어야한다.
  @Column({
    type: 'varchar',
    length: 255,
    comment: '끝난 날짜. 날짜의 형태: yyyy.MM',
    nullable: true,
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

  // ============================ //
  // ===== 관계 표시용 필드 ===== //
  // ============================ //
  @Column({ type: 'uuid', name: 'resume_id', comment: '연결된 이력서의 id' })
  resumeId: string;

  @ManyToOne(() => Resume, (resume) => resume.educationList)
  @JoinColumn({ name: 'resume_id' })
  resume: Relation<Resume>;
}

@ObjectType()
@Entity('career')
export class Career extends ICareer {}

@InputType()
export class CareerInputType extends ICareer {}
