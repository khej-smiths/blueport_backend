import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsOptional, Matches } from 'class-validator';
import { CommonEntity } from 'src/common/common.entity';
import { Column, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm';
import { Resume } from './resume.entity';

@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
abstract class IProject extends CommonEntity {
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

  @Column({ type: 'json', comment: '기술 스택', nullable: true })
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
@Entity('project')
export class Project extends IProject {}
