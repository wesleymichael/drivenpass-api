import { CardsDTO } from '@/cards/dto/cards.dto';
import { PrismaService } from '@/prisma/prisma.service';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Cryptr = require('cryptr');

export class CardsFactory {
  private bodyCard: CardsDTO;
  private userId: number;
  private code = process.env.SECRET_KEY_CRYPTR;
  private cryptr = new Cryptr(this.code);

  constructor(private readonly prisma: PrismaService) {}

  withBodyCard(body: CardsDTO) {
    this.bodyCard = body;
    return this;
  }

  withUserId(userId: number) {
    this.userId = userId;
    return this;
  }

  build() {
    return {
      ...this.bodyCard,
      cvv: this.cryptr.encrypt(this.bodyCard.cvv) as string,
      password: this.cryptr.encrypt(this.bodyCard.password) as string,
      userId: this.userId,
    };
  }

  async persist() {
    const card = this.build();
    return await this.prisma.cards.create({
      data: card,
    });
  }
}
