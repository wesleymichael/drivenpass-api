import { ConflictException, Injectable } from '@nestjs/common';
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
}
