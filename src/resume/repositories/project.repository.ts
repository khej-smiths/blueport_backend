import { Injectable } from '@nestjs/common';
import { DataSource, DeleteResult, EntityManager, Repository } from 'typeorm';
import { Project } from '../entities/project.entity';
import { CreateProjectInputDto } from '../dtos/create-resume.dto';
import { UpdateProjectInputDto } from '../dtos/update-resume.dto';

@Injectable()
export class ProjectRepository extends Repository<Project> {
  constructor(private dataSource: DataSource) {
    super(Project, dataSource.createEntityManager());
  }

  /**
   * 프로젝트 생성
   */
  async createProjectList(
    input: Array<CreateProjectInputDto>,
    transactionEntityManager?: EntityManager, // transaction이 필요한 경우
  ): Promise<Array<Project>> {
    let creation: Array<Project>;
    let projectList: Array<Project>;

    // 트랜잭션 진행 여부에 맞춰서 학력 생성
    if (transactionEntityManager) {
      creation = transactionEntityManager.create(Project, input);
      projectList = await transactionEntityManager.save(Project, creation);
    } else {
      creation = this.create(input);
      projectList = await this.save(creation);
    }

    return projectList;
  }

  async updateProjectList(
    input: Array<UpdateProjectInputDto>,
    transactionEntityManager?: EntityManager,
  ): Promise<void> {
    let updateResult: Array<Project>;
    if (transactionEntityManager) {
      // 트랜잭션
      updateResult = await transactionEntityManager.save(Project, input);
    } else {
      updateResult = await this.save(input);
    }
  }

  async deleteProjectList(
    idList: Array<string>,
    transactionEntityManager?: EntityManager,
  ): Promise<DeleteResult> {
    let result: DeleteResult;
    if (transactionEntityManager) {
      result = await transactionEntityManager.delete(Project, idList);
    } else {
      result = await this.delete(idList);
    }

    return result;
  }
}
