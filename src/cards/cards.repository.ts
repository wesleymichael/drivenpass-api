import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CardsDTO } from './dto/cards.dto';

@Injectable()
export class CardsRepository {
  constructor(private readonly prisma: PrismaService) {}

  createCard(cardDTo: CardsDTO, userId: number) {
    return this.prisma.cards.create({
      data: {
        ...cardDTo,
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
}
