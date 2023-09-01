import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { LoginDTO } from '@/auth/dto/login.dto';

export async function login(app: INestApplication, body: LoginDTO) {
  return request(app.getHttpServer()).post('/auth/login').send(body);
}
