import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CardsDTO } from './dto/cards.dto';
import { Cards } from '@prisma/client';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Cryptr = require('cryptr');

@Injectable()
export class CardsRepository {
  private code = process.env.SECRET_KEY_CRYPTR;
  private cryptr = new Cryptr(this.code);

  constructor(private readonly prisma: PrismaService) {}

  createCard(cardDTo: CardsDTO, userId: number) {
    return this.prisma.cards.create({
      data: {
        ...cardDTo,
        cvv: this.cryptr.encrypt(cardDTo.cvv) as string,
        password: this.cryptr.encrypt(cardDTo.password) as string,
        userId,
      },
    });
  }

  findCardByUserIdAndTitle(userId: number, title: string) {
    return this.prisma.cards.findUnique({
      where: {
        userId_title: {
          userId,
          title,
        },
      },
    });
  }

  async findAllCards(userId: number) {
    const cards = await this.prisma.cards.findMany({
      where: { userId },
    });

    return this.decryptCardsData(cards);
  }

  findCardByNumber(cardNumber: string) {
    return this.prisma.cards.findUnique({
      where: { number: cardNumber },
    });
  }

  async findCardById(id: number) {
    const card = await this.prisma.cards.findFirst({
      where: { id },
    });
    return card ? this.decryptCardsData([card]) : [];
  }

  deleteCard(id: number) {
    return this.prisma.cards.delete({
      where: { id },
    });
  }

  private decryptCardsData(cards: Cards[]) {
    return cards.map((card) => {
      return {
        ...card,
        cvv: this.cryptr.decrypt(card.cvv) as string,
        password: this.cryptr.decrypt(card.password) as string,
      };
    });
  }
}
