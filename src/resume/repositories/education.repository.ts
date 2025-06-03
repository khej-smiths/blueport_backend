import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Education } from '../entities/education.entity';

@Injectable()
export class EducationRepository extends Repository<Education> {
  constructor(private dataSource: DataSource) {
    super(Education, dataSource.createEntityManager());
  }
}
