import { Injectable } from '@nestjs/common';
import { Resume } from './entities/resume.entity';
import { Wrapper } from 'src/logger/log.decorator';
import { CreateResumeInputDto } from './dtos/create-resume.dto';
import { LoggerStorage } from 'src/logger/logger-storage';
import { ResumeRepository } from './repositories/resume.repository';
import { EducationRepository } from './repositories/education.repository';
import { DataSource } from 'typeorm';
import { User } from 'src/user/user.entity';
import { CustomGraphQLError } from 'src/common/error';
import { CareerRepository } from './repositories/career.repository';
import {
  UpdateCareerInputDto,
  UpdateEducationInputDto,
  UpdatePortfolioInputDto,
  UpdateProjectInputDto,
  UpdateResumeInputDto,
} from './dtos/update-resume.dto';
import { ReadResumeInputDto } from './dtos/read-resume.dto';
import { ProjectRepository } from './repositories/project.repository';
import { PortfolioRepository } from './repositories/portfolio.repository';

@Injectable()
@Wrapper()
export class ResumeService {
  constructor(
    private readonly als: LoggerStorage,
    private readonly resumeRepository: ResumeRepository,
    private readonly educationRepository: EducationRepository,
    private readonly careerRepository: CareerRepository,
    private readonly projectRepository: ProjectRepository,
    private readonly portfolioRepository: PortfolioRepository,
    private readonly dataSource: DataSource,
  ) {}
  /**
   * 이력서 생성
   */
  async createResume(user: User, input: CreateResumeInputDto): Promise<Resume> {
    // 이 함수에서 발생하는 에러 케이스 정리
    const ERR_ALREADY_RESUME = 'ERR_ALREADY_RESUME'; // 이미 생성된 이력서가 있는 경우

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    let resume: Resume;

    try {
      // Resume 생성
      resume = await this.resumeRepository.createResume(
        { ownerId: user.id },
        queryRunner.manager,
      );

      // 학력 생성
      if (input.educationList) {
        const educationList =
          await this.educationRepository.createEducationList(
            input.educationList.map((elem) => {
              return { resumeId: resume.id, ...elem };
            }),
            queryRunner.manager,
          );
        resume.educationList = educationList;
      }

      // 경력 추가
      if (input.careerList) {
        const careerList = await this.careerRepository.createCareerList(
          input.careerList.map((elem) => {
            return { resumeId: resume.id, ...elem };
          }),
          queryRunner.manager,
        );
        resume.careerList = careerList;
      }

      // 프로젝트 추가
      if (input.projectList) {
        const projectList = await this.projectRepository.createProjectList(
          input.projectList.map((elem) => {
            return { resumeId: resume.id, ...elem };
          }),
          queryRunner.manager,
        );
        resume.projectList = projectList;
      }

      // 포트폴리오 추가
      if (input.portfolioList) {
        const portfolioList =
          await this.portfolioRepository.createPortfolioList(
            input.portfolioList.map((elem) => {
              return { resumeId: resume.id, ...elem };
            }),
            queryRunner.manager,
          );
        resume.portfolioList = portfolioList;
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error.code === 'ER_DUP_ENTRY') {
        error = new CustomGraphQLError('이미 작성된 이력서가 있습니다.', {
          extensions: { code: ERR_ALREADY_RESUME },
        });
      }

      throw error;
    } finally {
      await queryRunner.release();
    }

    return resume;
  }

  /**
   * 이력서 조회
   */
  async readResume(input: ReadResumeInputDto): Promise<Resume | null> {
    // 이력서 조회 중 발생할 수 있는 에러 케이스
    const ERR_MULTIPLE_DATA = 'ERR_MULTIPLE_DATA'; // 여러개의 이력서가 조회된 경우

    // 이력서 조회
    const resumeList = await this.resumeRepository.readResumeList({
      option: input,
      relations: [
        'educationList',
        'careerList',
        'projectList',
        'portfolioList',
      ],
    });

    let resume: Resume | null;

    // 이력서 조회 처리
    if (resumeList.length === 0) {
      // 이력서가 없는 경우 null 리턴
      resume = null;
    } else if (resumeList.length > 1) {
      throw new CustomGraphQLError('선택된 이력서가 여러개입니다.', {
        extensions: {
          code: ERR_MULTIPLE_DATA,
        },
      });
    } else {
      resume = resumeList[0];
    }

    // 이력서 리턴
    return resume;
  }

  /**
   * 이력서 수정
   */
  async updateResume(user: User, input: UpdateResumeInputDto): Promise<Resume> {
    // 이 함수에서 발생하는 에러 케이스 정리
    const ERR_NO_RESUME = 'ERR_NO_RESUME'; // 이력서가 없는 경우

    if (!user.resume) {
      throw new CustomGraphQLError('작성된 이력서가 없습니다.', {
        extensions: { code: ERR_NO_RESUME },
      });
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const meta: Record<
        'educationList' | 'careerList' | 'projectList' | 'portfolioList',
        {
          deletedIdList: Array<string>; // 삭제될 id 목록
          addedList: Array<
            | UpdateEducationInputDto
            | UpdateCareerInputDto
            | UpdateProjectInputDto
            | UpdatePortfolioInputDto
          >; // 추가될 목록
          updatedList: Array<
            | UpdateEducationInputDto
            | UpdateCareerInputDto
            | UpdateProjectInputDto
            | UpdatePortfolioInputDto
          >; // 수정될 목록
          updatedIdList: Array<string>; // 수정될 id 목록
          deleteFn: Function;
          createFn: Function;
        }
      > = {
        educationList: {
          deletedIdList: [],
          addedList: [],
          updatedList: [],
          updatedIdList: [],
          deleteFn: this.educationRepository.deleteEducationListByOption,
          createFn: this.educationRepository.createEducationList,
        },
        careerList: {
          deletedIdList: [],
          addedList: [],
          updatedList: [],
          updatedIdList: [],
          deleteFn: this.careerRepository.deleteCareerListByOption,
          createFn: this.careerRepository.createCareerList,
        },
        projectList: {
          deletedIdList: [],
          addedList: [],
          updatedList: [],
          updatedIdList: [],
          deleteFn: this.projectRepository.deleteProjectListByOption,
          createFn: this.projectRepository.createProjectList,
        },
        portfolioList: {
          deletedIdList: [],
          addedList: [],
          updatedList: [],
          updatedIdList: [],
          deleteFn: this.portfolioRepository.deletePortfolioListByOption,
          createFn: this.portfolioRepository.createPortfolioList,
        },
      };

      for await (const field of Object.keys(meta) as Array<keyof typeof meta>) {
        // 1. 기존 데이터 삭제
        await meta[field].deleteFn(
          {
            where: {
              resumeId: user.resume.id,
            },
          },
          queryRunner.manager,
        );
        // 2. 입력받은 input 데이터를 새로 입력
        await meta[field].createFn(
          input[field]?.map((elem) => {
            return { ...elem, resumeId: user.resume!.id };
          }),
          queryRunner.manager,
        );
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }

    return (await this.readResume({ id: user.resume.id })) as Resume;
  }
}
