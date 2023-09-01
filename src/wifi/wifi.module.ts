import { Module } from '@nestjs/common';
import { WifiController } from './wifi.controller';
import { WifiService } from './wifi.service';
import { UsersModule } from '@/users/users.module';
import { WifiRepository } from './wifi.repository';

@Module({
  imports: [UsersModule],
  controllers: [WifiController],
  providers: [WifiService, WifiRepository],
  exports: [WifiService],
})
export class WifiModule {}
