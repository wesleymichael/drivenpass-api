import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/prisma/prisma.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { cleanDB } from '../helpers';
import { RegisterDto } from '@/auth/dto/register.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, PrismaModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    prisma = await moduleFixture.resolve(PrismaService);

    await cleanDB(prisma);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/register (POST) => should create a user', async () => {
    const registerDTO: RegisterDto = new RegisterDto({
      email: 'teste@teste.com',
      password: '@Abcdefg1970',
    });
    await request(app.getHttpServer())
      .post('/auth/register')
      .send(registerDTO)
      .expect(HttpStatus.CREATED);

    const users = await prisma.users.findMany();
    expect(users).toHaveLength(1);
    const user = users[0];
    expect(user).toEqual({
      id: expect.any(Number),
      email: registerDTO.email,
      password: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it('/auth/register (POST) => should return status 400 if no password is sent', async () => {
    const registerDTO: RegisterDto = new RegisterDto({
      email: 'teste@teste.com',
    });
    await request(app.getHttpServer())
      .post('/auth/register')
      .send(registerDTO)
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('/auth/register (POST) => should return status 400 if no email is sent', async () => {
    const registerDTO: RegisterDto = new RegisterDto({
      password: '@Abcdefg1970',
    });
    await request(app.getHttpServer())
      .post('/auth/register')
      .send(registerDTO)
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('/auth/register (POST) => should return status 400 if a strong password is not sent', async () => {
    const registerDTO: RegisterDto = new RegisterDto({
      email: 'teste@teste.com',
      password: 'password',
    });
    await request(app.getHttpServer())
      .post('/auth/register')
      .send(registerDTO)
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('/auth/register (POST) => should return status 409 if email is already in use', async () => {
    const registerDTO: RegisterDto = new RegisterDto({
      email: 'teste@teste.com',
      password: '@Abcdefg1970',
    });
    await request(app.getHttpServer()).post('/auth/register').send(registerDTO);

    await request(app.getHttpServer())
      .post('/auth/register')
      .send(registerDTO)
      .expect(HttpStatus.CONFLICT);
  });
});
