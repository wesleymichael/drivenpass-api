import { LoginDTO } from './dto/login.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@/users/users.service';
import * as bcrypt from 'bcrypt';
import { Users } from '@prisma/client';

@Injectable()
export class AuthService {
  private EXPIRATION_TIME = '7 days';
  private ISSUER = 'WM';
  private AUDIENCE = 'users';

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async register(registerDTO: RegisterDto) {
    return await this.usersService.create(registerDTO);
  }

  async login(loginDTO: LoginDTO) {
    const { email, password } = loginDTO;
    const user = await this.usersService.getUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Email or password not valid.');
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Email or password not valid.');
    }

    return this.createToken(user);
  }

  createToken(user: Users) {
    const { id, email } = user;

    const token = this.jwtService.sign(
      { email },
      {
        expiresIn: this.EXPIRATION_TIME,
        subject: String(id),
        issuer: this.ISSUER,
        audience: this.AUDIENCE,
      },
    );

    return { token };
  }
}
