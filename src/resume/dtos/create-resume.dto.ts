import { Field, InputType, PickType } from '@nestjs/graphql';
import { EducationInputType } from '../entities/education.entity';
import { CareerInputType } from '../entities/career.entity';

@InputType()
export class CreateEducationInputDto extends PickType(EducationInputType, [
  'order',
  'name',
  'major',
  'grade',
  'description',
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
}
