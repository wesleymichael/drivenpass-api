import { Body, Controller, Delete, UseGuards } from '@nestjs/common';
import { EraseService } from './erase.service';
import { User } from '@/decorators/user.decorator';
import { Users } from '@prisma/client';
import { bodyDTO } from './dto/erase.dto';
import { AuthGuard } from '@/guards/auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Erase')
@UseGuards(AuthGuard)
@Controller('erase')
export class EraseController {
  constructor(private readonly eraseService: EraseService) {}

  @Delete()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'object',
      properties: { password: { type: 'string', example: '@StrongPassword1' } },
    },
  })
  @ApiOperation({ summary: 'Delete account' })
  @ApiUnauthorizedResponse({ description: 'Token not sent or invalid' })
  @ApiOkResponse({ description: 'Account deleted successfully' })
  async eraseAccount(@Body() body: bodyDTO, @User() user: Users) {
    await this.eraseService.deleteAccount(user.email, body.password);
    return { message: 'Account successfully deleted' };
  }
}
