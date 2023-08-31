import { Injectable } from '@nestjs/common';
import { CredentialDTO } from './dto/credentials.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { Credentials } from '@prisma/client';
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
        password: this.cryptr.encrypt(credentialsDTO.password) as string,
        userId,
      },
    });
  }

  findCredentialByUserIdAndTitle(userId: number, title: string) {
    return this.prisma.credentials.findUnique({
      where: {
        userId_title: {
          userId,
          title,
        },
      },
    });
  }

  async findAllCredentialsByUserId(userId: number) {
    const credentials = await this.prisma.credentials.findMany({
      where: { userId },
    });

    return this.decrypCredentialsPassword(credentials);
  }

  async findCredentialByIdAndUserId(id: number, userId: number) {
    const credential = await this.prisma.credentials.findUnique({
      where: {
        id,
        userId,
      },
    });
    return this.decrypCredentialsPassword([credential]);
  }

  findCredentialById(id: number) {
    return this.prisma.credentials.findUnique({
      where: { id },
    });
  }

  private decrypCredentialsPassword(credentials: Credentials[]) {
    return credentials.map((credential) => {
      return {
        ...credential,
        password: this.cryptr.decrypt(credential.password) as string,
      };
    });
  }
}
