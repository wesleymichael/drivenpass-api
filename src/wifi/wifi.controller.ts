import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { WifiService } from './wifi.service';
import { AuthGuard } from '@/guards/auth.guard';
import { User } from '@/decorators/user.decorator';
import { Users } from '@prisma/client';
import { WifiDTO } from './dto/wifi.dto';

@UseGuards(AuthGuard)
@Controller('wifi')
export class WifiController {
  constructor(private readonly wifiService: WifiService) {}

  @Post()
  async createCredential(@Body() wifiDTO: WifiDTO, @User() user: Users) {
    return await this.wifiService.createWifi(user.id, wifiDTO);
  }
}
