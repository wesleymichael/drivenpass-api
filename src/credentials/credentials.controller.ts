import {
  BadRequestException,
  Body,
  Controller,
  Delete,
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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CredentialResponse } from './dto/credentialResponse';

@ApiTags('Credentials - Login information for a website or service')
@UseGuards(AuthGuard)
@Controller('credentials')
export class CredentialsController {
  constructor(private readonly credentialsService: CredentialsService) {}

  @Post()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiBearerAuth()
  @ApiBody({ type: CredentialDTO })
  @ApiOperation({ summary: 'Create credential' })
  @ApiUnauthorizedResponse({ description: 'Token not sent or invalid' })
  @ApiConflictResponse({ description: 'Title already exist' })
  @ApiCreatedResponse({ description: 'Success', type: CredentialResponse })
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
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Find all credentials' })
  @ApiUnauthorizedResponse({ description: 'Token not sent or invalid' })
  @ApiOkResponse({
    description: 'Success - returns an array of objects',
    type: [CredentialResponse],
  })
  async findAllCredentials(@User() user: Users) {
    return await this.credentialsService.findAllCredentialsByUserId(user.id);
  }

  @Get('/:id')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Find credential by credentialId' })
  @ApiParam({ name: 'id', description: 'Credential id', example: 1 })
  @ApiUnauthorizedResponse({ description: 'Token not sent or invalid' })
  @ApiBadRequestResponse({ description: 'Id not valid' })
  @ApiNotFoundResponse({
    description: 'There is no credential for the submitted id',
  })
  @ApiForbiddenResponse({ description: 'CredentialId belongs to another user' })
  @ApiOkResponse({ description: 'Success', type: CredentialResponse })
  async findCredentialById(
    @Param('id', ParseIntPipe) id: number,
    @User() user: Users,
  ) {
    if (id <= 0) {
      throw new BadRequestException('ID must be a positive integer');
    }
    return await this.credentialsService.findCredentialById(id, user.id);
  }

  @Delete('/:id')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete credential by credentialId' })
  @ApiParam({ name: 'id', description: 'Credential id', example: 1 })
  @ApiBadRequestResponse({ description: 'Id not valid' })
  @ApiUnauthorizedResponse({ description: 'Token not sent or invalid' })
  @ApiForbiddenResponse({ description: 'CredentialId belongs to another user' })
  @ApiOkResponse({ description: 'Success' })
  async deleteCredential(
    @Param('id', ParseIntPipe) id: number,
    @User() user: Users,
  ) {
    if (id <= 0) {
      throw new BadRequestException('ID must be a positive integer');
    }
    return await this.credentialsService.deleteCredential(id, user.id);
  }
}
