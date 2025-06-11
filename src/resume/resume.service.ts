import { Injectable } from '@nestjs/common';
import { Resume } from './entities/resume.entity';
import { Wrapper } from 'src/logger/log.decorator';
import { CreateResumeInputDto } from './dtos/create-resume.dto';
import { LoggerStorage } from 'src/logger/logger-storage';
import { ResumeRepository } from './resume.repository';
import { EducationRepository } from './repositories/education.repository';
import { DataSource } from 'typeorm';
import { User } from 'src/user/user.entity';
import { CustomGraphQLError } from 'src/common/error';
import { CareerRepository } from './repositories/career.repository';

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
}
