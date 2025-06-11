import { InputType, PickType } from '@nestjs/graphql';
import { ResumeInputType } from '../entities/resume.entity';

@InputType()
export class ReadResumeInputDto extends PickType(ResumeInputType, ['id']) {}
