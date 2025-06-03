import { DataSource, Repository } from 'typeorm';
import { Resume } from './resume.entity';
import { Injectable } from '@nestjs/common';
import { CreateResumeInputDto } from './dtos/create-resume.dto';

@Injectable()
export class ResumeRepository extends Repository<Resume> {
  constructor(private dataSource: DataSource) {
    super(Resume, dataSource.createEntityManager());
  }

  async createResume(input: CreateResumeInputDto): Promise<Resume> {
    const creation = await this.create(input);

    const resume = await this.save(creation);
    return resume;
  }
}
