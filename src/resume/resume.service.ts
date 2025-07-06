import { Injectable } from '@nestjs/common';
import { Resume } from './entities/resume.entity';
import { Wrapper } from 'src/logger/log.decorator';
import { CreateResumeInputDto } from './dtos/create-resume.dto';
import { LoggerStorage } from 'src/logger/logger-storage';
import { ResumeRepository } from './repositories/resume.repository';
import { DataSource } from 'typeorm';
import { User } from 'src/user/user.entity';
import { CustomGraphQLError } from 'src/common/error';
import { UpdateResumeInputDto } from './dtos/update-resume.dto';
import { ReadResumeInputDto } from './dtos/read-resume.dto';

@Injectable()
@Wrapper()
export class ResumeService {
  constructor(
    private readonly als: LoggerStorage,
    private readonly resumeRepository: ResumeRepository,
  ) {}
  /**
   * 이력서 생성
   */
  async createResume(user: User, input: CreateResumeInputDto): Promise<Resume> {
    // 이 함수에서 발생하는 에러 케이스 정리
    const ERR_ALREADY_RESUME = 'ERR_ALREADY_RESUME'; // 이미 생성된 이력서가 있는 경우

    let resume: Resume;

    try {
      // Resume 생성
      resume = await this.resumeRepository.createResume({
        ownerId: user.id,
        educationList: input.educationList,
        careerList: input.careerList,
        projectList: input.projectList,
        portfolioList: input.portfolioList,
      });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        error = new CustomGraphQLError('이미 작성된 이력서가 있습니다.', {
          extensions: { code: ERR_ALREADY_RESUME },
        });
      }
      throw error;
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

    const updateResult = await this.resumeRepository.updateResume({
      id: user.resume.id,
      educationList: input.educationList,
      careerList: input.careerList,
      projectList: input.projectList,
      portfolioList: input.portfolioList,
    });

    if (updateResult.affected === 0) {
      throw new CustomGraphQLError('이력서 수정에 실패했습니다.', {
        extensions: { code: ERR_NO_RESUME },
      });
    }

    return (await this.readResume({ id: user.resume.id })) as Resume;
  }
}
