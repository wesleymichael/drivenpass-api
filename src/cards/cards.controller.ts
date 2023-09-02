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
import { CardsService } from './cards.service';
import { AuthGuard } from '@/guards/auth.guard';
import { CardsDTO } from './dto/cards.dto';
import { User } from '@/decorators/user.decorator';
import { Users } from '@prisma/client';
import {
  ApiTags,
  ApiBody,
  ApiOperation,
  ApiBearerAuth,
  ApiHeader,
  ApiUnauthorizedResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiParam,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { CardResponse } from './dto/cardResponse';

@ApiTags('Cards')
@UseGuards(AuthGuard)
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiBearerAuth()
  @ApiBody({ type: CardsDTO })
  @ApiOperation({ summary: 'Create card' })
  @ApiUnauthorizedResponse({ description: 'Token not sent or invalid' })
  @ApiConflictResponse({ description: 'Title or card number already exist' })
  @ApiCreatedResponse({ description: 'Success', type: CardResponse })
  async createCredential(@Body() cardDTO: CardsDTO, @User() user: Users) {
    return await this.cardsService.createCard(cardDTO, user.id);
  }

  @Get()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Find all cards' })
  @ApiUnauthorizedResponse({ description: 'Token not sent or invalid' })
  @ApiOkResponse({
    description: 'Success - returns an array of objects',
    type: [CardResponse],
  })
  async findAllCards(@User() user: Users) {
    return this.cardsService.findAllCards(user.id);
  }

  @Get('/:id')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Find card by cardId' })
  @ApiParam({ name: 'id', description: 'Card id', example: 1 })
  @ApiUnauthorizedResponse({ description: 'Token not sent or invalid' })
  @ApiBadRequestResponse({ description: 'Id not valid' })
  @ApiNotFoundResponse({ description: 'There is no card for the submitted id' })
  @ApiForbiddenResponse({ description: 'CardId belongs to another user' })
  @ApiOkResponse({ description: 'Success', type: CardResponse })
  async findCredentialById(
    @Param('id', ParseIntPipe) id: number,
    @User() user: Users,
  ) {
    if (id <= 0) {
      throw new BadRequestException('ID must be a positive integer');
    }
    return await this.cardsService.findCardById(id, user.id);
  }

  @Delete('/:id')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete card by cardId' })
  @ApiParam({ name: 'id', description: 'Card id', example: 1 })
  @ApiBadRequestResponse({ description: 'Id not valid' })
  @ApiUnauthorizedResponse({ description: 'Token not sent or invalid' })
  @ApiForbiddenResponse({ description: 'CardId belongs to another user' })
  @ApiOkResponse({ description: 'Success' })
  async deleteCard(@Param('id', ParseIntPipe) id: number, @User() user: Users) {
    if (id <= 0) {
      throw new BadRequestException('ID must be a positive integer');
    }

    return await this.cardsService.deleteCard(id, user.id);
  }
}
