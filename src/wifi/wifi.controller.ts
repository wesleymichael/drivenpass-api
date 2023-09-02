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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { WifiResponse } from './dto/wifiResponse';

@ApiTags('Wifi')
@UseGuards(AuthGuard)
@ApiBearerAuth('Authorization')
@Controller('wifi')
export class WifiController {
  constructor(private readonly wifiService: WifiService) {}

  @Post()
  @ApiBody({ type: WifiDTO })
  @ApiOperation({ summary: 'Create wifi' })
  @ApiUnauthorizedResponse({ description: 'Token not sent or invalid' })
  @ApiCreatedResponse({ description: 'Success', type: WifiResponse })
  async createCredential(@Body() wifiDTO: WifiDTO, @User() user: Users) {
    return await this.wifiService.createWifi(user.id, wifiDTO);
  }

  @Get()
  @ApiOperation({ summary: 'Find all wifi data' })
  @ApiUnauthorizedResponse({ description: 'Token not sent or invalid' })
  @ApiOkResponse({
    description: 'Success - returns an array of objects',
    type: [WifiResponse],
  })
  async findAllWifi(@User() user: Users) {
    return await this.wifiService.findAllWifiByUserId(user.id);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Find wifi by wifiId' })
  @ApiParam({ name: 'id', description: 'Wifi id', example: 1 })
  @ApiUnauthorizedResponse({ description: 'Token not sent or invalid' })
  @ApiBadRequestResponse({ description: 'Id not valid' })
  @ApiNotFoundResponse({ description: 'There is no wifi for the submitted id' })
  @ApiForbiddenResponse({ description: 'WifiId belongs to another user' })
  @ApiOkResponse({ description: 'Success', type: WifiResponse })
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
  @ApiOperation({ summary: 'Delete wifi by wifiId' })
  @ApiParam({ name: 'id', description: 'Wifi id', example: 1 })
  @ApiBadRequestResponse({ description: 'Id not valid' })
  @ApiUnauthorizedResponse({ description: 'Token not sent or invalid' })
  @ApiForbiddenResponse({ description: 'WifiId belongs to another user' })
  @ApiOkResponse({ description: 'Success' })
  async deleteWifi(@Param('id', ParseIntPipe) id: number, @User() user: Users) {
    if (id <= 0) {
      throw new BadRequestException('ID must be a positive integer');
    }
    return await this.wifiService.deleteWifi(id, user.id);
  }
}
