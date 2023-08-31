import { Injectable } from '@nestjs/common';
import { CredentialDTO } from './dto/credentials.dto';
import { PrismaService } from '@/prisma/prisma.service';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Cryptr = require('cryptr');

@Injectable()
export class CredentialsRepository {
  private code = process.env.SECRET_KEY_CRYPTR;
  private cryptr = new Cryptr(this.code);
  constructor(private readonly prisma: PrismaService) {}

  createCredential(userId: number, credentialsDTO: CredentialDTO) {
    return this.prisma.credentials.create({
      data: {
        ...credentialsDTO,
        password: this.cryptr.encrypt(credentialsDTO.password),
        userId,
      },
    });
  }
}
