/* eslint-disable prettier/prettier */
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CredentialsRepository } from './credentials.repository';
import { CredentialDTO } from './dto/credentials.dto';

@Injectable()
export class CredentialsService {
  constructor(private readonly repository: CredentialsRepository) {}

  async createCredential(userId: number, credentialsDTO: CredentialDTO) {
    const credential = await this.repository.findCredentialByUserIdAndTitle(
      userId,
      credentialsDTO.title,
    );
    if (credential) {
      throw new ConflictException('A title with that name already exists.');
    }
    return await this.repository.createCredential(userId, credentialsDTO);
  }

  async findAllCredentialsByUserId(userId: number) {
    return await this.repository.findAllCredentialsByUserId(userId);
  }

  async findCredentialByIdAndUserId(id: number, userId: number) {
    const credentialById = await this.repository.findCredentialById(id);
    if (!credentialById) {
      throw new NotFoundException('There is no credential for the submitted id');
    }

    const credential =  await this.repository.findCredentialByIdAndUserId(id, userId);
    if(credential.length === 0) {
      throw new ForbiddenException('credential belongs to another user');
    }

    return credential;
  }
}
