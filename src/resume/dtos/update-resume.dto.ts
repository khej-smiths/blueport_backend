import { Field, InputType, PickType } from '@nestjs/graphql';
import { EducationInputType } from '../entities/education.entity';
import { CareerInputType } from '../entities/career.entity';
import { ProjectInputType } from '../entities/project.entity';
import { PortfolioInputType } from '../entities/portfolio.entity';

@InputType()
export class UpdateEducationInputDto extends PickType(EducationInputType, [
  'order',
  'name',
  'major',
  'grade',
  'standardGrade',
  'graduationStatus',
  'startAt',
  'endAt',
]) {}

@InputType()
export class UpdateCareerInputDto extends PickType(CareerInputType, [
  'order',
  'company',
  'department',
  'position',
  'description',
  'startAt',
  'endAt',
]) {}

@InputType()
export class UpdateProjectInputDto extends PickType(ProjectInputType, [
  'order',
  'name',
  'personnel',
  'skillList',
  'description',
  'startAt',
  'endAt',
]) {}

@InputType()
export class UpdatePortfolioInputDto extends PickType(PortfolioInputType, [
  'order',
  'url',
]) {}

@InputType()
export class UpdateResumeInputDto {
  @Field(() => [UpdateEducationInputDto], {
    nullable: true,
    description: '학력',
  })
  educationList?: Array<UpdateEducationInputDto>;

  @Field(() => [UpdateCareerInputDto], {
    nullable: true,
    description: '경력',
  })
  careerList?: Array<UpdateCareerInputDto>;

  @Field(() => [UpdateProjectInputDto], {
    nullable: true,
    description: '프로젝트',
  })
  projectList?: Array<UpdateProjectInputDto>;

  @Field(() => [UpdatePortfolioInputDto], {
    nullable: true,
    description: '포트폴리오',
  })
  portfolioList?: Array<UpdatePortfolioInputDto>;
}
