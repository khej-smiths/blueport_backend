import {
  Args,
  Mutation,
  Parent,
  ResolveField,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { ResumeService } from './resume.service';
import { Resume } from './entities/resume.entity';
import { input } from 'src/common/consts';
import { CreateResumeInputDto } from './dtos/create-resume.dto';
import {
  AccessRole,
  AuthUser,
  RequiredRelationList,
} from 'src/auth/auth.decorator';
import { User } from 'src/user/user.entity';
import { UpdateResumeInputDto } from './dtos/update-resume.dto';
import { ReadResumeInputDto } from './dtos/read-resume.dto';
import { UserDataLoaderService } from 'src/user/user.data-loader';

@Resolver(Resume)
export class ResumeResolver {
  constructor(
    private readonly resumeService: ResumeService,
    private readonly userDataLoaderService: UserDataLoaderService,
  ) {}
  @AccessRole('USER')
  @Mutation(() => Resume, { description: '이력서 생성' })
  async createResume(
    @Args(input) input: CreateResumeInputDto,
    @AuthUser() user: User,
  ): Promise<Resume> {
    return await this.resumeService.createResume(user, input);
  }

  @Query(() => Resume, { description: '이력서 조회' })
  async readResume(@Args(input) input: ReadResumeInputDto): Promise<Resume> {
    return await this.resumeService.readResume(input);
  }

  @AccessRole('USER')
  @RequiredRelationList([
    'resume',
    'resume.educationList',
    'resume.careerList',
    'resume.projectList',
    'resume.portfolioList',
  ])
  @Mutation(() => Resume, { description: '이력서 수정' })
  async updateResume(
    @Args(input) input: UpdateResumeInputDto,
    @AuthUser() user: User,
  ): Promise<Resume> {
    return await this.resumeService.updateResume(user, input);
  }

  @ResolveField('owner', () => User, {
    description: '이력서 주인',
  })
  async readUser(@Parent() resume: Resume): Promise<User> {
    return this.userDataLoaderService.getUsersByIds.load(resume.ownerId);
  }
}
