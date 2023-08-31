import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
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

  @Get()
  async findAllCredentials(@User() user: Users) {
    return await this.credentialsService.findAllCredentialsByUserId(user.id);
  }

  @Get('/:id')
  async findCredentialById(
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory: () => new BadRequestException('Invalid ID format'),
      }),
    )
    id: number,
    @User() user: Users,
  ) {
    if (id <= 0) {
      throw new BadRequestException('ID must be a positive integer');
    }
    return await this.credentialsService.findCredentialByIdAndUserId(
      id,
      user.id,
    );
  }
}
