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

@UseGuards(AuthGuard)
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  async createCredential(@Body() cardDTO: CardsDTO, @User() user: Users) {
    return await this.cardsService.createCard(cardDTO, user.id);
  }

  @Get()
  async findAllCards(@User() user: Users) {
    return this.cardsService.findAllCards(user.id);
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
    return await this.cardsService.findCardById(id, user.id);
  }

  @Delete('/:id')
  async deleteCard(
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
    return await this.cardsService.deleteCard(id, user.id);
  }
}
