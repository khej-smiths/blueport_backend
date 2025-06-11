import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ResumeService } from './resume.service';
import { Resume } from './entities/resume.entity';
import { input } from 'src/common/consts';
import { CreateResumeInputDto } from './dtos/create-resume.dto';
import { AccessRole, AuthUser } from 'src/auth/auth.decorator';
import { User } from 'src/user/user.entity';

@Resolver()
export class ResumeResolver {
  constructor(private readonly resumeService: ResumeService) {}
  // TODO 이력서 생성
  @AccessRole('USER')
  @Mutation(() => Resume, { description: '이력서 생성' })
  async createResume(
    @Args(input) input: CreateResumeInputDto,
    @AuthUser() user: User,
  ): Promise<Resume> {
    return await this.resumeService.createResume(user, input);
  }
  // TODO 이력서 수정
}
