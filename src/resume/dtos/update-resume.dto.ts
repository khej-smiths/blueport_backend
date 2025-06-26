import {
  Field,
  InputType,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { EducationInputType } from '../entities/education.entity';
import { CareerInputType } from '../entities/career.entity';
import { ProjectInputType } from '../entities/project.entity';
import { PortfolioInputType } from '../entities/portfolio.entity';

@InputType()
export class UpdateEducationInputDto extends IntersectionType(
  PickType(EducationInputType, [
    'order',
    'name',
    'major',
    'grade',
    'standardGrade',
    'graduationStatus',
    'startAt',
    'endAt',
  ]),
  PartialType(PickType(EducationInputType, ['id'])),
) {}

@InputType()
export class UpdateCareerInputDto extends IntersectionType(
  PickType(CareerInputType, [
    'order',
    'company',
    'department',
    'position',
    'description',
    'startAt',
    'endAt',
  ]),
  PartialType(PickType(CareerInputType, ['id'])),
) {}

@InputType()
export class UpdateProjectInputDto extends IntersectionType(
  PickType(ProjectInputType, [
    'order',
    'name',
    'personnel',
    'skillList',
    'description',
    'startAt',
    'endAt',
  ]),
  PartialType(PickType(ProjectInputType, ['id'])),
) {}

@InputType()
export class UpdatePortfolioInputDto extends IntersectionType(
  PickType(PortfolioInputType, ['order', 'url']),
  PartialType(PickType(PortfolioInputType, ['id'])),
) {}

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
