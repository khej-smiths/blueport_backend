import { Module } from '@nestjs/common';
import { ResumeResolver } from './resume.resolver';
import { ResumeService } from './resume.service';
import { ResumeRepository } from './repositories/resume.repository';
import { EducationRepository } from './repositories/education.repository';
import { CareerRepository } from './repositories/career.repository';
import { ProjectRepository } from './repositories/project.repository';
import { PortfolioRepository } from './repositories/portfolio.repository';
import { UserModule } from 'src/user/user.module';
import { ResumeDataLoaderService } from './resume.data-loader';

@Module({
  providers: [
    ResumeResolver,
    ResumeService,
    ResumeRepository,
    EducationRepository,
    CareerRepository,
    ProjectRepository,
    PortfolioRepository,
    ResumeDataLoaderService,
  ],
  imports: [UserModule],
  exports: [ResumeDataLoaderService],
})
export class ResumeModule {}
