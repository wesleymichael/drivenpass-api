import { Module } from '@nestjs/common';
import { EraseController } from './erase.controller';
import { EraseService } from './erase.service';
import { UsersModule } from '@/users/users.module';
import { CardsModule } from '@/cards/cards.module';
import { CredentialsModule } from '@/credentials/credentials.module';
import { NotesModule } from '@/notes/notes.module';
import { WifiModule } from '@/wifi/wifi.module';

@Module({
  imports: [
    UsersModule,
    CardsModule,
    CredentialsModule,
    NotesModule,
    WifiModule,
  ],
  controllers: [EraseController],
  providers: [EraseService],
})
export class EraseModule {}
