import { DataSource, DeleteResult, EntityManager, Repository } from 'typeorm';
import { Career } from '../entities/career.entity';
import { CreateCareerInputDto } from '../dtos/create-resume.dto';
import { Injectable } from '@nestjs/common';
import { UpdateCareerInputDto } from '../dtos/update-resume.dto';

@Injectable()
export class CareerRepository extends Repository<Career> {
  constructor(private dataSource: DataSource) {
    super(Career, dataSource.createEntityManager());
  }

  /**
   * 경력 생성
   */
  async createCareerList(
    input: Array<CreateCareerInputDto>,
    transactionEntityManager?: EntityManager, // transaction이 필요한 경우
  ): Promise<Array<Career>> {
    let creation: Array<Career>;
    let careerList: Array<Career>;

    // 트랜잭션 진행 여부에 맞춰서 학력 생성
    if (transactionEntityManager) {
      creation = transactionEntityManager.create(Career, input);
      careerList = await transactionEntityManager.save(Career, creation);
    } else {
      creation = this.create(input);
      careerList = await this.save(creation);
    }

    return careerList;
  }

  async updateCareerList(
    input: Array<UpdateCareerInputDto>,
    transactionEntityManager?: EntityManager,
  ): Promise<void> {
    let updateResult: Array<Career>;
    if (transactionEntityManager) {
      // 트랜잭션
      updateResult = await transactionEntityManager.save(Career, input);
    } else {
      updateResult = await this.save(input);
    }
  }

  /**
   * 이력서 id를 기준으로 전체 경력 삭제
   */
  async deleteCareerListByOption(
    option: {
      where: { resumeId: string };
    },
    transactionEntityManager?: EntityManager,
  ) {
    let result: DeleteResult;

    if (transactionEntityManager) {
      result = await transactionEntityManager.delete(Career, option.where);
    } else {
      result = await this.delete(option.where);
    }
  }
}
