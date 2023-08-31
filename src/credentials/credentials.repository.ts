import { Injectable } from '@nestjs/common';
import { CredentialDTO } from './dto/credentials.dto';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class CredentialsRepository {
  constructor(private readonly prisma: PrismaService) {}

  createCredential(userId: number, credentialsDTO: CredentialDTO) {
    return this.prisma.credentials.create({
      data: {
        ...credentialsDTO,
        userId,
      },
    });
  }
}
