import { Module } from '@nestjs/common';
import { ResumeResolver } from './resume.resolver';
import { ResumeService } from './resume.service';
import { ResumeRepository } from './resume.repository';

@Module({
  providers: [ResumeResolver, ResumeService, ResumeRepository],
})
export class ResumeModule {}
