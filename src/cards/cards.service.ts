import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CardsRepository } from './cards.repository';
import { CardsDTO } from './dto/cards.dto';

@Injectable()
export class CardsService {
  constructor(private readonly repository: CardsRepository) {}

  async createCard(cardDTO: CardsDTO, userId: number) {
    const card = await this.repository.findCardByUserIdAndTitle(
      userId,
      cardDTO.title,
    );
    if (card) {
      throw new ConflictException('A title with that name already exists.');
    }
    return await this.repository.createCard(cardDTO, userId);
  }

  async findAllCards(userId: number) {
    return await this.repository.findAllCards(userId);
  }

  async findCardById(id: number, userId: number) {
    const card = await this.repository.findCardById(id);
    if (card.length === 0) {
      throw new NotFoundException('There is no card for the submitted id');
    }

    if (card[0].userId !== userId) {
      throw new ForbiddenException('Credential belongs to another user');
    }

    return card;
  }
}
