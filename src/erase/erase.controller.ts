import { Body, Controller, Delete, UseGuards } from '@nestjs/common';
import { EraseService } from './erase.service';
import { User } from '@/decorators/user.decorator';
import { Users } from '@prisma/client';
import { bodyDTO } from './dto/erase.dto';
import { AuthGuard } from '@/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('erase')
export class EraseController {
  constructor(private readonly eraseService: EraseService) {}

  @Delete()
  async eraseAccount(@Body() body: bodyDTO, @User() user: Users) {
    await this.eraseService.deleteAccount(user.email, body.password);
    return { message: 'Account successfully deleted' };
  }
}
