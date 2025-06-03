import { Injectable } from '@nestjs/common';
import { Resume } from './resume.entity';
import { Wrapper } from 'src/logger/log.decorator';
import { CreateResumeInputDto } from './dtos/create-resume.dto';
import { LoggerStorage } from 'src/logger/logger-storage';
import { ResumeRepository } from './resume.repository';

@Injectable()
@Wrapper()
export class ResumeService {
  constructor(
    private readonly als: LoggerStorage,
    private readonly resumeRepository: ResumeRepository,
  ) {}
  async createResume(input: CreateResumeInputDto): Promise<Resume> {
    return await this.resumeRepository.createResume(input);
  }
}
