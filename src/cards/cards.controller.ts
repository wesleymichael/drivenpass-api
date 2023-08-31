import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
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
}
