import { WifiDTO } from './dto/wifi.dto';
import { WifiRepository } from './wifi.repository';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class WifiService {
  constructor(private readonly repository: WifiRepository) {}

  async createWifi(userId: number, wifiDTO: WifiDTO) {
    return await this.repository.createWifi(userId, wifiDTO);
  }

  async findAllWifiByUserId(userId: number) {
    return await this.repository.findAllWifiByUserId(userId);
  }

  async findWifiById(id: number, userId: number) {
    const wifi = await this.repository.findWifiById(id);
    if (wifi.length === 0) {
      throw new NotFoundException('There is no wifi data for the submitted id');
    }

    if (wifi[0].userId !== userId) {
      throw new ForbiddenException('Wifi data belongs to another user');
    }

    return wifi;
  }

  async deleteWifi(id: number, userId: number) {
    const wifi = await this.repository.findWifiById(id);
    if (wifi.length === 0) {
      throw new NotFoundException('There is no wifi data for the submitted id');
    }

    if (wifi[0].userId !== userId) {
      throw new ForbiddenException('Wifi data belongs to another user');
    }

    return await this.repository.deleteWifi(id);
  }
}
