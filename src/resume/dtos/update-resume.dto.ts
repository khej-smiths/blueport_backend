import { Field, InputType, PickType } from '@nestjs/graphql';
import { EducationInputType } from '../entities/education.entity';
import { CareerInputType } from '../entities/career.entity';
import { ProjectInputType } from '../entities/project.entity';
import { PortfolioInputType } from '../entities/portfolio.entity';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

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
  @ValidateNested({ each: true })
  @Type(() => UpdateEducationInputDto)
  educationList?: Array<UpdateEducationInputDto>;

  @Field(() => [UpdateCareerInputDto], {
    nullable: true,
    description: '경력',
  })
  @ValidateNested({ each: true })
  @Type(() => UpdateCareerInputDto)
  careerList?: Array<UpdateCareerInputDto>;

  @Field(() => [UpdateProjectInputDto], {
    nullable: true,
    description: '프로젝트',
  })
  @ValidateNested({ each: true })
  @Type(() => UpdateProjectInputDto)
  projectList?: Array<UpdateProjectInputDto>;

  @Field(() => [UpdatePortfolioInputDto], {
    nullable: true,
    description: '포트폴리오',
  })
  @ValidateNested({ each: true })
  @Type(() => UpdatePortfolioInputDto)
  portfolioList?: Array<UpdatePortfolioInputDto>;
}
