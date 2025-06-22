import { InputType, PartialType, PickType } from '@nestjs/graphql';
import { ResumeInputType } from '../entities/resume.entity';

@InputType()
export class ReadResumeInputDto extends PartialType(
  PickType(ResumeInputType, ['id', 'ownerId']),
) {}
