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

    return this.decryptCredentialsPassword(credentials);
  }

  async findCredentialById(id: number) {
    const credential = await this.prisma.credentials.findFirst({
      where: { id },
    });
    return credential ? this.decryptCredentialsPassword([credential]) : [];
  }

  deleteCredential(id: number) {
    return this.prisma.credentials.delete({
      where: { id },
    });
  }

  deleteAllCredentials(userId: number) {
    return this.prisma.credentials.deleteMany({
      where: { userId },
    });
  }

  private decryptCredentialsPassword(credentials: Credentials[]) {
    return credentials.map((credential) => {
      return {
        ...credential,
        password: this.cryptr.decrypt(credential.password) as string,
      };
    });
  }
}
