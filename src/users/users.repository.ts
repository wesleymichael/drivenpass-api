import { UsersDTO } from './dto/users.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  private SALT = 10;

  create(userDTO: UsersDTO) {
    return this.prisma.users.create({
      data: {
        ...userDTO,
        password: bcrypt.hashSync(userDTO.password, this.SALT),
      },
    });
  }

  getUserByEmail(email: string) {
    return this.prisma.users.findUnique({
      where: { email },
    });
  }
}
