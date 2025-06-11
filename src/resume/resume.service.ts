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
  UpdateEducationInputDto,
  UpdateResumeInputDto,
} from './dtos/update-resume.dto';
import { ReadResumeInputDto } from './dtos/read-resume.dto';

@Injectable()
@Wrapper()
export class ResumeService {
  constructor(
    private readonly als: LoggerStorage,
    private readonly resumeRepository: ResumeRepository,
    private readonly educationRepository: EducationRepository,
    private readonly careerRepository: CareerRepository,
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

    try {
      // Resume 생성
      const resume = await this.resumeRepository.createResume(
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

      return resume;
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
  }

  async readResume(input: ReadResumeInputDto): Promise<Resume> {
    const ERR_NO_DATA = 'ERR_NO_DATA';
    const ERR_MULTIPLE_DATA = 'ERR_MULTIPLE_DATA';

    const resumeList = await this.resumeRepository.readResumeList({
      id: input.id,
      relations: ['educationList', 'careerList'],
    });

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

    return resumeList[0];
  }

  /**
   * 이력서 수정
   */
  async updateResume(user: User, input: UpdateResumeInputDto): Promise<Resume> {
    // 이 함수에서 발생하는 에러 케이스 정리
    const ERR_NO_RESUME = 'ERR_NO_RESUME'; // 이력서가 없는 경우

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (!user.resume) {
        throw new CustomGraphQLError('작성된 이력서가 없습니다.', {
          extensions: { code: ERR_NO_RESUME },
        });
      } else {
        // 학력 수정
        if (user.resume.educationList) {
          // 삭제될 학력의 id 목록
          const deleteIdList: Array<string> = [];
          // 추가될 학력 목록
          const addedEduList: Array<UpdateEducationInputDto> = [];
          // 업데이트될 학력 목록
          const updatedEduList: Array<UpdateEducationInputDto> = [];
          // 업데이트될 학력의 id 목록
          const updatedEduIdList: Array<string> = [];

          if (!input.educationList || input.educationList.length === 0) {
            // input으로 들어온 educationList가 없거나, 들어왔다하더라도 길이가 0인 경우, 기존 학력을 모두 삭제
            deleteIdList.push(
              ...user.resume.educationList.map((elem) => elem.id),
            );
          } else {
            // input으로 들어온 학력을 확인해서 업데이트와 신설 학력 구분
            for (const edu of input.educationList) {
              if (edu.id) {
                updatedEduIdList.push(edu.id);
                updatedEduList.push(edu);
              } else {
                addedEduList.push(edu);
              }
            }

            // 기존 학력을 확인해서, 업데이트되지 않는 경우 삭제 id에 추가
            for (const originEdu of user.resume.educationList) {
              if (!updatedEduIdList.includes(originEdu.id)) {
                // 새로 입력받은 학력 데이터에 id가 없는 경우 삭제
                deleteIdList.push(originEdu.id);
              }
            }
          }

          // 삭제해야하는 학력이 있는 경우
          if (deleteIdList.length > 0) {
            await this.educationRepository.deleteEducationList(deleteIdList);
          }

          // 업데이트해야하는 학력이 있는 경우
          if (updatedEduList.length > 0) {
          }

          // 신설해야하는 학력이 있는 경우
          if (addedEduList.length > 0) {
            await this.educationRepository.createEducationList(
              addedEduList.map((elem) => {
                return {
                  resumeId: user.resume!.id,
                  ...elem,
                };
              }),
              queryRunner.manager,
            );
          }
        }
      }
    } catch (error) {
      throw error;
    }

    return {} as Resume;
  }
}
