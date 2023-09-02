import { AuthService } from './auth.service';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiBody({ type: RegisterDto })
  @ApiOperation({ summary: 'Register a user' })
  @ApiConflictResponse({ description: 'Email already in use' })
  @ApiBadRequestResponse({ description: 'Email or password not sent' })
  @ApiCreatedResponse({
    description: 'Success',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          example: 1,
        },
        email: {
          type: 'string',
          example: 'example@example.com',
        },
        password: {
          type: 'string',
          example: 'hashedPassword',
        },
        createdAt: {
          type: 'string',
          example: '2023-08-28T15:30:00.000Z',
        },
        updatedAt: {
          type: 'string',
          example: '2023-08-28T15:30:00.000Z',
        },
      },
    },
  })
  @HttpCode(HttpStatus.CREATED)
  register(@Body() registerDTO: RegisterDto) {
    return this.authService.register(registerDTO);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: RegisterDto })
  @ApiOperation({ summary: 'Authenticate a user' })
  @ApiBadRequestResponse({ description: 'Email or password not sent' })
  @ApiUnauthorizedResponse({ description: 'Incorrect email or password' })
  @ApiOkResponse({
    description: 'Return a token for use',
    schema: {
      type: 'object',
      properties: {
        token: {
          type: 'string',
        },
      },
    },
  })
  login(@Body() loginDTO: LoginDTO) {
    return this.authService.login(loginDTO);
  }
}
