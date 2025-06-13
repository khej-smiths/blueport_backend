import { Field, InputType, PickType } from '@nestjs/graphql';
import { EducationInputType } from '../entities/education.entity';
import { CareerInputType } from '../entities/career.entity';
import { ProjectInputType } from '../entities/project.entity';

@InputType()
export class CreateEducationInputDto extends PickType(EducationInputType, [
  'order',
  'name',
  'major',
  'grade',
  'description',
  'graduationStatus',
  'startAt',
  'endAt',
]) {}

@InputType()
export class CreateCareerInputDto extends PickType(CareerInputType, [
  'order',
  'company',
  'department',
  'position',
  'description',
  'startAt',
  'endAt',
]) {}

@InputType()
export class CreateProjectInputDto extends PickType(ProjectInputType, [
  'order',
  'name',
  'personnel',
  'skillList',
  'description',
  'startAt',
  'endAt',
]) {}

@InputType()
export class CreateResumeInputDto {
  @Field(() => [CreateEducationInputDto], {
    nullable: true,
    description: '학력',
  })
  educationList?: Array<CreateEducationInputDto>;

  @Field(() => [CreateCareerInputDto], {
    nullable: true,
    description: '경력',
  })
  careerList?: Array<CreateCareerInputDto>;

  @Field(() => [CreateProjectInputDto], {
    nullable: true,
    description: '프로젝트',
  })
  projectList?: Array<CreateProjectInputDto>;
}
