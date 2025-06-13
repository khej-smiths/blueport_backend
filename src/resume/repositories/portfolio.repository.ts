import { Injectable } from '@nestjs/common';
import { DataSource, DeleteResult, EntityManager, Repository } from 'typeorm';
import { CreatePortfolioInputDto } from '../dtos/create-resume.dto';
import { UpdatePortfolioInputDto } from '../dtos/update-resume.dto';
import { Portfolio } from '../entities/portfolio.entity';

@Injectable()
export class PortfolioRepository extends Repository<Portfolio> {
  constructor(private dataSource: DataSource) {
    super(Portfolio, dataSource.createEntityManager());
  }

  /**
   * 포트폴리오 생성
   */
  async createPortfolioList(
    input: Array<CreatePortfolioInputDto>,
    transactionEntityManager?: EntityManager, // transaction이 필요한 경우
  ): Promise<Array<Portfolio>> {
    let creation: Array<Portfolio>;
    let portfolioList: Array<Portfolio>;

    // 트랜잭션 진행 여부에 맞춰서 학력 생성
    if (transactionEntityManager) {
      creation = transactionEntityManager.create(Portfolio, input);
      portfolioList = await transactionEntityManager.save(Portfolio, creation);
    } else {
      creation = this.create(input);
      portfolioList = await this.save(creation);
    }

    return portfolioList;
  }

  async updatePortfolioList(
    input: Array<UpdatePortfolioInputDto>,
    transactionEntityManager?: EntityManager,
  ): Promise<void> {
    let updateResult: Array<Portfolio>;
    if (transactionEntityManager) {
      // 트랜잭션
      updateResult = await transactionEntityManager.save(Portfolio, input);
    } else {
      updateResult = await this.save(input);
    }
  }

  async deletePortfolioList(
    idList: Array<string>,
    transactionEntityManager?: EntityManager,
  ): Promise<DeleteResult> {
    let result: DeleteResult;
    if (transactionEntityManager) {
      result = await transactionEntityManager.delete(Portfolio, idList);
    } else {
      result = await this.delete(idList);
    }

    return result;
  }
}
