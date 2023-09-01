import { PrismaService } from '@/prisma/prisma.service';
import { WifiDTO } from '@/wifi/dto/wifi.dto';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Cryptr = require('cryptr');

export class WifisFactory {
  private bodyWifi: WifiDTO;
  private userId: number;
  private code = process.env.SECRET_KEY_CRYPTR;
  private cryptr = new Cryptr(this.code);

  constructor(private readonly prisma: PrismaService) {}

  withBodyWifi(body: WifiDTO) {
    this.bodyWifi = body;
    return this;
  }

  withUserId(userId: number) {
    this.userId = userId;
    return this;
  }

  build() {
    return {
      ...this.bodyWifi,
      userId: this.userId,
    };
  }

  async persist() {
    const wifi = this.build();
    return await this.prisma.wifi.create({
      data: {
        ...wifi,
        password: this.cryptr.encrypt(wifi.password) as string,
      },
    });
  }
}
