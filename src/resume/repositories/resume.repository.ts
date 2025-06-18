import { DataSource, EntityManager, In, Repository } from 'typeorm';
import { Resume } from '../entities/resume.entity';
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

  /**
   * 이력서 목록 조회
   */
  async readResumeList(input: { id: string; relations?: Array<string> }) {
    return await this.find({
      where: { id: input.id },
      ...(input.relations && { relations: input.relations }),
    });
  }

  /** 이력서 id 조회 by 옵션 소유주 id */
  async readResumeIdListByOption(option: {
    ownerIdList?: Array<string>;
  }): Promise<Array<Resume>> {
    return await this.find({
      select: ['id', 'ownerId'],
      where: {
        ...(option.ownerIdList && { ownerId: In(option.ownerIdList) }),
      },
    });
  }
}
