import { Module } from '@nestjs/common';
import { ResumeResolver } from './resume.resolver';
import { ResumeService } from './resume.service';
import { ResumeRepository } from './resume.repository';
import { EducationRepository } from './repositories/education.repository';

@Module({
  providers: [
    ResumeResolver,
    ResumeService,
    ResumeRepository,
    EducationRepository,
  ],
})
export class ResumeModule {}
