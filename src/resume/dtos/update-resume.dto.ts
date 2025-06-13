import {
  Field,
  InputType,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { EducationInputType } from '../entities/education.entity';
import { CareerInputType } from '../entities/career.entity';

@InputType()
export class UpdateEducationInputDto extends IntersectionType(
  PickType(EducationInputType, [
    'order',
    'name',
    'major',
    'grade',
    'description',
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
}
