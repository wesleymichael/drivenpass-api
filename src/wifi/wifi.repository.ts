import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { WifiDTO } from './dto/wifi.dto';
import { Wifi } from '@prisma/client';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Cryptr = require('cryptr');

@Injectable()
export class WifiRepository {
  private code = process.env.SECRET_KEY_CRYPTR;
  private cryptr = new Cryptr(this.code);

  constructor(private readonly prisma: PrismaService) {}

  createWifi(userId: number, wifiDTO: WifiDTO) {
    return this.prisma.wifi.create({
      data: {
        ...wifiDTO,
        password: this.cryptr.encrypt(wifiDTO.password) as string,
        userId,
      },
    });
  }

  async findAllWifiByUserId(userId: number) {
    const wifi = await this.prisma.wifi.findMany({
      where: { userId },
    });

    return this.decryptWifiData(wifi);
  }

  private decryptWifiData(wifi: Wifi[]) {
    return wifi.map((wifiObj) => {
      return {
        ...wifiObj,
        password: this.cryptr.decrypt(wifiObj.password) as string,
      };
    });
  }
}
