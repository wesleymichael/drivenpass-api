import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
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

  @Get()
  async findAllWifi(@User() user: Users) {
    return await this.wifiService.findAllWifiByUserId(user.id);
  }

  @Get('/:id')
  async findWifiById(
    @Param('id', ParseIntPipe) id: number,
    @User() user: Users,
  ) {
    if (id <= 0) {
      throw new BadRequestException('ID must be a positive integer');
    }
    return await this.wifiService.findWifiById(id, user.id);
  }

  @Delete('/:id')
  async deleteWifi(@Param('id', ParseIntPipe) id: number, @User() user: Users) {
    if (id <= 0) {
      throw new BadRequestException('ID must be a positive integer');
    }
    return await this.wifiService.deleteWifi(id, user.id);
  }
}
