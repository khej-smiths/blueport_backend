import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CommonEntity } from 'src/common/common.entity';
import { Education } from './education.entity';
import { User } from 'src/user/user.entity';
import {
  Entity,
  OneToOne,
  JoinColumn,
  Relation,
  Column,
  OneToMany,
} from 'typeorm';
import { Career } from './career.entity';
import { Project } from './project.entity';
import { Portfolio } from './portfolio.entity';

@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
abstract class IResume extends CommonEntity {
  @Column({
    type: 'uuid',
    name: 'owner_id',
    comment: '이력서 주인의 id',
    unique: true,
  })
  @Field(() => String, { description: '이력서 주인의 id' })
  ownerId: string;

  // 이력서 주인 전체 정보
  @OneToOne(() => User, (user) => user.resume)
  @JoinColumn({ name: 'owner_id' })
  @Field(() => User, { description: '게시글 작성자 전체 정보' })
  owner: Relation<User>;

  @Column({ type: 'json', name: 'education_list', nullable: true })
  @Field(() => [Education], { nullable: true, description: '학력' })
  educationList?: Array<Education>;

  @Column({ type: 'json', name: 'career_list', nullable: true })
  @Field(() => [Career], { nullable: true, description: '경력' })
  careerList?: Array<Career>;

  @Column({ type: 'json', name: 'project_list', nullable: true })
  @Field(() => [Project], { nullable: true, description: '프로젝트' })
  projectList?: Array<Project>;

  @Column({ type: 'json', name: 'portfolio_list', nullable: true })
  @Field(() => [Portfolio], { nullable: true, description: '포트폴리오' })
  portfolioList?: Array<Portfolio>;
}

@ObjectType()
@Entity('resume')
export class Resume extends IResume {}

@InputType()
export class ResumeInputType extends IResume {}
