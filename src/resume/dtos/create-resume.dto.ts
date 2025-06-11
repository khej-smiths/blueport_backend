import { Field, InputType, PickType } from '@nestjs/graphql';
import { EducationInputType } from '../entities/education.entity';

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
export class CreateResumeInputDto {
  @Field(() => [CreateEducationInputDto], {
    nullable: true,
    description: '학력',
  })
  educationList?: Array<CreateEducationInputDto>;
}
