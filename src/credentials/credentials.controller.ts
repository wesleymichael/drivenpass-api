import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CredentialsService } from './credentials.service';
import { AuthGuard } from '@/guards/auth.guard';
import { CredentialDTO } from './dto/credentials.dto';
import { User } from '@/decorators/user.decorator';
import { Users } from '@prisma/client';

@UseGuards(AuthGuard)
@Controller('credentials')
export class CredentialsController {
  constructor(private readonly credentialsService: CredentialsService) {}

  @Post()
  async createCredential(
    @Body() credentialDTO: CredentialDTO,
    @User() user: Users,
  ) {
    return await this.credentialsService.createCredential(
      user.id,
      credentialDTO,
    );
  }
}
