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
  async readResume(input: ReadResumeInputDto): Promise<Resume> {
    // 이력서 조회 중 발생할 수 있는 에러 케이스
    const ERR_NO_DATA = 'ERR_NO_DATA'; // 조회할 이력서가 없는 경우
    const ERR_MULTIPLE_DATA = 'ERR_MULTIPLE_DATA'; // 여러개의 이력서가 조회된 경우

    // 이력서 조회
    const resumeList = await this.resumeRepository.readResumeList({
      id: input.id,
      relations: [
        'educationList',
        'careerList',
        'projectList',
        'portfolioList',
      ],
    });

    // 이력서 조회 관련 에러 처리
    if (resumeList.length === 0) {
      throw new CustomGraphQLError('이력서 조회에 실패했습니다.', {
        extensions: {
          code: ERR_NO_DATA,
        },
      });
    } else if (resumeList.length > 1) {
      throw new CustomGraphQLError('선택된 이력서가 여러개입니다.', {
        extensions: {
          code: ERR_MULTIPLE_DATA,
        },
      });
    }

    // 이력서 리턴
    return resumeList[0];
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
      // TODO 학력 외에도 적용할 수 있도록 for문으로 수정중
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
          updateFn: Function;
          createFn: Function;
        }
      > = {
        educationList: {
          deletedIdList: [],
          addedList: [],
          updatedList: [],
          updatedIdList: [],
          deleteFn: this.educationRepository.deleteEducationList,
          updateFn: this.educationRepository.updateEducationList,
          createFn: this.educationRepository.createEducationList,
        },
        careerList: {
          deletedIdList: [],
          addedList: [],
          updatedList: [],
          updatedIdList: [],
          deleteFn: this.careerRepository.deleteCareerList,
          updateFn: this.careerRepository.updateCareerList,
          createFn: this.careerRepository.createCareerList,
        },
        projectList: {
          deletedIdList: [],
          addedList: [],
          updatedList: [],
          updatedIdList: [],
          deleteFn: this.projectRepository.deleteProjectList,
          updateFn: this.projectRepository.updateProjectList,
          createFn: this.projectRepository.createProjectList,
        },
        portfolioList: {
          deletedIdList: [],
          addedList: [],
          updatedList: [],
          updatedIdList: [],
          deleteFn: this.portfolioRepository.deletePortfolioList,
          updateFn: this.portfolioRepository.updatePortfolioList,
          createFn: this.portfolioRepository.createPortfolioList,
        },
      };

      for await (const field of Object.keys(meta) as Array<keyof typeof meta>) {
        const {
          deletedIdList,
          addedList,
          updatedList,
          updatedIdList,
          deleteFn,
          updateFn,
          createFn,
        } = meta[field];

        if (!input[field] || input[field].length === 0) {
          // input으로 들어온 배열이 없거나, 배열의 길이가 0인 경우 해당 필드 전체 내역을 삭제
          deletedIdList.push(
            ...(user.resume[field] as Array<any>)?.map((elem) => elem.id),
          );
        } else {
          // input으로 들어온 배열이 유의미하게 있는 경우 > 수정 / 신설 / 삭제 구분해서 처리
          for (const elem of input[field]) {
            if (elem.id) {
              // id가 있는 경우 > 업데이트
              updatedIdList.push(elem.id);
              updatedList.push(elem);
            } else {
              // id가 없는 경우 > 신설
              addedList.push(elem);
            }
          }

          // input으로 들어온 필드가 원래 이력서에도 있는 경우, id값을 확인해서 삭제 케이스 확인
          if (user.resume[field]) {
            for (const originalElem of user.resume[field]!) {
              if (!updatedIdList.includes(originalElem.id)) {
                // 새로 입력받은 데이터에 id가 없는 경우, 원 배열에서 삭제
                deletedIdList.push(originalElem.id);
              }
            }
          }
        }

        // 원래 데이터에서 삭제해야하는 경우
        if (deletedIdList.length > 0) {
          await deleteFn(deletedIdList, queryRunner.manager);
        }

        // 원래 데이터에서 업데이트해야하는 경우
        if (updatedList.length > 0) {
          await updateFn(updatedList, queryRunner.manager);
        }

        // 신설해야하는 경우
        if (addedList.length > 0) {
          await createFn(
            addedList.map((elem) => {
              return {
                resumeId: user.resume!.id,
                ...elem,
              };
            }),
            queryRunner.manager,
          );
        }
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }

    return await this.readResume({ id: user.resume.id });
  }
}
