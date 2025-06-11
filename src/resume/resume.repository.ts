import { DataSource, EntityManager, Repository } from 'typeorm';
import { Resume } from './entities/resume.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ResumeRepository extends Repository<Resume> {
  constructor(private dataSource: DataSource) {
    super(Resume, dataSource.createEntityManager());
  }

  /**
   * 이력서 생성
   */
  async createResume(
    input: { ownerId: string },
    transactionEntityManager?: EntityManager, // transaction이 필요한 경우
  ): Promise<Resume> {
    let creation: Resume;
    let resume: Resume;

    if (transactionEntityManager) {
      creation = transactionEntityManager.create(Resume, input);
      resume = await transactionEntityManager.save(Resume, creation);
    } else {
      creation = this.create(input);
      resume = await this.save(creation);
    }

    return resume;
  }
}
