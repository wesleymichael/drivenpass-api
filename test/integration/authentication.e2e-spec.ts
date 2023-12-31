import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/prisma/prisma.service';
import { RegisterDto } from '@/auth/dto/register.dto';
import { RegisterFactory } from '../factories/register.factory';
import { E2EUtils } from '../helpers';

describe('authController (e2e)', () => {
  let app: INestApplication;
  const prisma: PrismaService = new PrismaService();

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prisma)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    await E2EUtils.cleanDb(prisma);
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  describe('/auth/register (POST)', () => {
    it('should create a user', async () => {
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
    it('should return status 400 if no password is sent', async () => {
      const registerDTO: RegisterDto = new RegisterDto({
        email: 'teste@teste.com',
      });
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDTO)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should return status 400 if no email is sent', async () => {
      const registerDTO: RegisterDto = new RegisterDto({
        password: '@Abcdefg1970',
      });
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDTO)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should return status 400 if a strong password is not sent', async () => {
      const registerDTO: RegisterDto = new RegisterDto({
        email: 'teste@teste.com',
        password: 'password',
      });
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDTO)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should return status 409 if email is already in use', async () => {
      const registerDTO: RegisterDto = new RegisterDto({
        email: 'teste@teste.com',
        password: '@Abcdefg1970',
      });
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDTO);

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDTO)
        .expect(HttpStatus.CONFLICT);
    });
  });

  describe('/auth/login (POST)', () => {
    it('should return token if login is successful', async () => {
      const user = await new RegisterFactory(prisma)
        .withEmail('teste@teste.com')
        .withPassword('@Abcdefg1970')
        .persist();

      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: user.email, password: '@Abcdefg1970' })
        .expect(HttpStatus.OK);

      expect(res.body).toEqual({
        token: expect.any(String),
      });
    });

    it('should return status 400 if no password is sent', async () => {
      const user = await new RegisterFactory(prisma)
        .withEmail('teste@teste.com')
        .withPassword('@Abcdefg1970')
        .persist();

      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: user.email })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should return status 400 if no email is sent', async () => {
      await new RegisterFactory(prisma)
        .withEmail('teste@teste.com')
        .withPassword('@Abcdefg1970')
        .persist();

      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ password: '@Abcdefg1970' })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should return status 401 if email not valid', async () => {
      await new RegisterFactory(prisma)
        .withEmail('teste@teste.com')
        .withPassword('@Abcdefg1970')
        .persist();

      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'other@email.com', password: '@Abcdefg1970' })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return status 401 if password not valid', async () => {
      const user = await new RegisterFactory(prisma)
        .withEmail('teste@teste.com')
        .withPassword('@Abcdefg1970')
        .persist();

      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: user.email, password: '@InvalidPassword' })
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });
});
