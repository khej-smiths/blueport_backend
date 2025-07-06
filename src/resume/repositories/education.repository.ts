// import { DataSource, DeleteResult, EntityManager, Repository } from 'typeorm';
// import { Injectable } from '@nestjs/common';
// import { Education } from '../entities/education.entity';
// import { CreateEducationInputDto } from '../dtos/create-resume.dto';
// import { UpdateEducationInputDto } from '../dtos/update-resume.dto';

// @Injectable()
// export class EducationRepository extends Repository<Education> {
//   constructor(private dataSource: DataSource) {
//     super(Education, dataSource.createEntityManager());
//   }

//   /**
//    * 학력 생성
//    */
//   async createEducationList(
//     input: Array<CreateEducationInputDto>,
//     transactionEntityManager?: EntityManager, // transaction이 필요한 경우
//   ): Promise<Array<Education>> {
//     let creation: Array<Education>;
//     let educationList: Array<Education>;

//     // 트랜잭션 진행 여부에 맞춰서 학력 생성
//     if (transactionEntityManager) {
//       creation = transactionEntityManager.create(Education, input);
//       educationList = await transactionEntityManager.save(Education, creation);
//     } else {
//       creation = this.create(input);
//       educationList = await this.save(creation);
//     }

//     return educationList;
//   }

//   async updateEducationList(
//     input: Array<UpdateEducationInputDto>,
//     transactionEntityManager?: EntityManager,
//   ): Promise<void> {
//     let updateResult: Array<Education>;
//     if (transactionEntityManager) {
//       // 트랜잭션
//       updateResult = await transactionEntityManager.save(Education, input);
//     } else {
//       updateResult = await this.save(input);
//     }
//   }

//   /**
//    * 이력서 id를 기준으로 전체 학력 삭제
//    */
//   async deleteEducationListByOption(
//     option: {
//       where: { resumeId: string };
//     },
//     transactionEntityManager?: EntityManager,
//   ) {
//     let result: DeleteResult;

//     if (transactionEntityManager) {
//       result = await transactionEntityManager.delete(Education, option.where);
//     } else {
//       result = await this.delete(option.where);
//     }
//   }
// }
