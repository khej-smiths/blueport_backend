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

  @OneToOne(() => User, (user) => user.resume)
  @JoinColumn({ name: 'owner_id' })
  @Field(() => User, { description: '이력서 주인 전체 정보' })
  owner: Relation<User>;

  @OneToMany(() => Education, (edu) => edu.resume, { nullable: true })
  @Field(() => [Education], { nullable: true, description: '학력' })
  educationList?: Array<Education>;

  @OneToMany(() => Career, (career) => career.resume, { nullable: true })
  @Field(() => [Career], { nullable: true, description: '경력' })
  careerList?: Array<Career>;

  // TODO 프로젝트
  // TODO 포트폴리오
}

@ObjectType()
@Entity('resume')
export class Resume extends IResume {}
