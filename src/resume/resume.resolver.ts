import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ResumeService } from './resume.service';
import { Resume } from './entities/resume.entity';
import { input } from 'src/common/consts';
import { CreateResumeInputDto } from './dtos/create-resume.dto';

@Resolver()
export class ResumeResolver {
  constructor(private readonly resumeService: ResumeService) {}
  // TODO 이력서 생성
  @Mutation(() => Resume, { description: '이력서 생성' })
  async createResume(
    @Args(input) input: CreateResumeInputDto,
  ): Promise<Resume> {
    return await this.resumeService.createResume(input);
  }
  // TODO 이력서 수정
}
