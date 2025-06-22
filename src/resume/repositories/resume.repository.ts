import { DataSource, EntityManager, Repository } from 'typeorm';
import { Resume } from '../entities/resume.entity';
import { Injectable } from '@nestjs/common';
import { ReadResumeInputDto } from '../dtos/read-resume.dto';
import { CustomGraphQLError } from 'src/common/error';
import { Wrapper } from 'src/logger/log.decorator';
import { LoggerStorage } from 'src/logger/logger-storage';

@Injectable()
@Wrapper()
export class ResumeRepository extends Repository<Resume> {
  constructor(
    private dataSource: DataSource,
    private readonly als: LoggerStorage,
  ) {
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
  async readResumeList(input: {
    option: ReadResumeInputDto;
    relations?: Array<string>;
  }) {
    const ERR_AT_LEAST_ONE_FIELD = 'ERR_AT_LEAST_ONE_FIELD'; // 입력한 input 옵션이 없는 경우

    if (Object.keys(input.option).length === 0) {
      throw new CustomGraphQLError(
        '이력서 조회를 위한 옵션을 다시 확인해주세요.',
        {
          extensions: { code: ERR_AT_LEAST_ONE_FIELD },
        },
      );
    }

    return await this.find({
      ...(input.option && {
        where: {
          id: input.option.id,
          ownerId: input.option.ownerId,
        },
      }),
      ...(input.relations && { relations: input.relations }),
    });
  }
}
