import { Resume } from './resume.entity';
import {
  Field,
  Float,
  InputType,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsOptional, Matches } from 'class-validator';
import { CommonEntity } from 'src/common/common.entity';
import { Column, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm';

/**
 * 졸업 조건
 */
export enum GRADUATION_STATUS {
  GRADUATED = 'GRADUATED',
  ENROLLED = 'ENROLLED',
  EXPECTED_GRADUATION = 'EXPECTED_GRADUATION',
}
registerEnumType(GRADUATION_STATUS, {
  name: 'GRADUATION_STATUS',
  description: '졸업 조건',
  valuesMap: {
    GRADUATED: {
      description: '졸업',
    },
    ENROLLED: {
      description: '재학중',
    },
    EXPECTED_GRADUATION: {
      description: '졸업 예정',
    },
  },
});

@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
abstract class IEducation extends CommonEntity {
  @Column({ type: 'int', unsigned: true, comment: '순서' })
  @Field(() => Int, { description: '정렬 순서' })
  order: number;

  @Column({ type: 'varchar', length: 255, comment: '교육기관명' })
  @Field(() => String, { description: '교육기관명' })
  name: string;

  @Column({ type: 'varchar', length: 255, comment: '전공', nullable: true })
  @Field(() => String, { description: '전공', nullable: true })
  major?: string;

  @Column({
    type: 'decimal',
    precision: 3, // 전체 자리수(정수 + 소수)
    scale: 2, // 소수점 이하 자리수
    comment: '학점',
    nullable: true,
  })
  @Field(() => Float, { description: '학점', nullable: true })
  grade?: number;

  @Column({
    type: 'decimal',
    precision: 3, // 전체 자리수(정수 + 소수)
    scale: 2, // 소수점 이하 자리수
    comment: '기준 학점',
    nullable: true,
    name: 'standard_grade',
  })
  @Field(() => Float, { description: '학점', nullable: true })
  standardGrade?: number;

  @Column({
    type: 'varchar',
    length: 255,
    comment: '졸업 상태',
    nullable: true,
  })
  @Field(() => GRADUATION_STATUS, { description: '졸업 상태', nullable: true })
  graduationStatus?: GRADUATION_STATUS;

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

  // TODO 값이 있는 경우에는 startAt과 같거나 뒤에 있어야한다.
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
@Entity('education')
export class Education extends IEducation {}

@InputType()
export class EducationInputType extends IEducation {}
