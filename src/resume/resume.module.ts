import { Module } from '@nestjs/common';
import { ResumeResolver } from './resume.resolver';
import { ResumeService } from './resume.service';
import { ResumeRepository } from './repositories/resume.repository';
import { UserModule } from 'src/user/user.module';
import { ResumeDataLoaderService } from './resume.data-loader';

@Module({
  providers: [
    ResumeResolver,
    ResumeService,
    ResumeRepository,
    ResumeDataLoaderService,
  ],
  imports: [UserModule],
  exports: [ResumeDataLoaderService],
})
export class ResumeModule {}
