import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UsersDTO } from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  async create(userDTO: UsersDTO) {
    const { email } = userDTO;
    const user = await this.repository.getUserByEmail(email);
    if (user) {
      throw new NotFoundException('Email already in use.');
    }

    return await this.repository.create(userDTO);
  }
}
