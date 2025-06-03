import { InputType, PickType } from '@nestjs/graphql';
import { ResumeInputType } from '../resume.entity';

@InputType()
export class CreateResumeInputDto extends PickType(ResumeInputType, [
  'educationList',
]) {}
