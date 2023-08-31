import { Injectable } from '@nestjs/common';
import { CredentialsRepository } from './credentials.repository';
import { CredentialDTO } from './dto/credentials.dto';

@Injectable()
export class CredentialsService {
  constructor(private readonly repository: CredentialsRepository) {}

  async createCredential(userId: number, credentialsDTO: CredentialDTO) {
    return await this.repository.createCredential(userId, credentialsDTO);
  }
}
