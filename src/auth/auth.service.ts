import { Injectable } from '@nestjs/common';
import { LoginInputDto } from './dtos/login.dto';

@Injectable()
export class AuthService {
  async login(input: LoginInputDto): Promise<string> {
    return 'token';
  }
}
