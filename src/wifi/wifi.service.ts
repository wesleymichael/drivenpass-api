import { WifiDTO } from './dto/wifi.dto';
import { WifiRepository } from './wifi.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WifiService {
  constructor(private readonly repository: WifiRepository) {}

  async createWifi(userId: number, wifiDTO: WifiDTO) {
    return await this.repository.createWifi(userId, wifiDTO);
  }

  async findAllWifiByUserId(userId: number) {
    return await this.repository.findAllWifiByUserId(userId);
  }
}
