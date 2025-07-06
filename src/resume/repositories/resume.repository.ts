import { DataSource, In, Repository, UpdateResult } from 'typeorm';
import { Resume } from '../entities/resume.entity';
import { Injectable } from '@nestjs/common';
import { ReadResumeInputDto } from '../dtos/read-resume.dto';
import { CustomGraphQLError } from 'src/common/error';
import { Wrapper } from 'src/logger/log.decorator';
import { LoggerStorage } from 'src/logger/logger-storage';
import { Education } from '../entities/education.entity';
import { Career } from '../entities/career.entity';
import { Project } from '../entities/project.entity';
import { Portfolio } from '../entities/portfolio.entity';

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
  async createResume(input: {
    ownerId: string;
    educationList?: Array<Education>;
    careerList?: Array<Career>;
    projectList?: Array<Project>;
    portfolioList?: Array<Portfolio>;
  }): Promise<Resume> {
    let creation = this.create(input);
    let resume = await this.save(creation);

    return resume;
  }

  /**
   * 이력서 목록 조회
   */
  async readResumeList(input: { option: ReadResumeInputDto }) {
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
    });
  }

  async updateResume(input: {
    id: string;
    educationList?: Array<Education>;
    careerList?: Array<Career>;
    projectList?: Array<Project>;
    portfolioList?: Array<Portfolio>;
  }): Promise<UpdateResult> {
    const updateResult = await this.update(
      { id: input.id },
      {
        educationList: input.educationList,
        careerList: input.careerList,
        projectList: input.projectList,
        portfolioList: input.portfolioList,
      },
    );
    return updateResult;
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
