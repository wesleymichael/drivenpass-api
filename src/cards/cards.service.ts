import { Injectable } from '@nestjs/common';
import { CardsRepository } from './cards.repository';
import { CardsDTO } from './dto/cards.dto';

@Injectable()
export class CardsService {
  constructor(private readonly repository: CardsRepository) {}

  async createCard(cardDTO: CardsDTO, userId: number) {
    //TODO validar se já existe titulo cadastrado pelo usuário
    return await this.repository.createCard(cardDTO, userId);
  }
}
