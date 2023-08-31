import { ConflictException, Injectable } from '@nestjs/common';
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
}
