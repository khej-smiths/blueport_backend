import { Module } from '@nestjs/common';
import { ResumeResolver } from './resume.resolver';
import { ResumeService } from './resume.service';
import { ResumeRepository } from './repositories/resume.repository';
import { EducationRepository } from './repositories/education.repository';
import { CareerRepository } from './repositories/career.repository';

@Module({
  providers: [
    ResumeResolver,
    ResumeService,
    ResumeRepository,
    EducationRepository,
    CareerRepository,
  ],
})
export class ResumeModule {}
