import { Module } from '@nestjs/common';
import { ResumeResolver } from './resume.resolver';
import { ResumeService } from './resume.service';
import { ResumeRepository } from './repositories/resume.repository';
import { EducationRepository } from './repositories/education.repository';
import { CareerRepository } from './repositories/career.repository';
import { ProjectRepository } from './repositories/project.repository';

@Module({
  providers: [
    ResumeResolver,
    ResumeService,
    ResumeRepository,
    EducationRepository,
    CareerRepository,
    ProjectRepository,
  ],
})
export class ResumeModule {}
