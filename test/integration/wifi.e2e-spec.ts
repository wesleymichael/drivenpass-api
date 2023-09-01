import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/prisma/prisma.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { cleanDB } from '../helpers';
import { RegisterFactory } from '../factories/register.factory';
import { login } from '../factories/login';
import { BodyLogin } from '../factories/body.login';
import { faker } from '@faker-js/faker';
import { BodyWifi } from '../factories/wifi.body';
import { WifisFactory } from '../factories/wifi.factory';

describe('wifiController (e2e)', () => {
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

  describe('/wifi (POST)', () => {
    it('should respond with status 401 if no token is given', async () => {
      const bodyWifi = new BodyWifi().generate();
      await request(app.getHttpServer())
        .post('/wifi')
        .send(bodyWifi)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
      const token = faker.lorem.word();
      const bodyWifi = new BodyWifi().generate();
      await request(app.getHttpServer())
        .post('/wifi')
        .send(bodyWifi)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should create a Wifi', async () => {
      const bodyLogin = new BodyLogin().generate();
      await new RegisterFactory(prisma)
        .withEmail(bodyLogin.email)
        .withPassword(bodyLogin.password)
        .persist();

      const { body } = await login(app, bodyLogin);

      const bodyWifi = new BodyWifi().generate();
      await request(app.getHttpServer())
        .post('/wifi')
        .send(bodyWifi)
        .set('Authorization', `Bearer ${body.token}`)
        .expect(HttpStatus.CREATED);
    });
  });

  describe('/wifi (GET)', () => {
    it('should respond with status 401 if no token is given', async () => {
      await request(app.getHttpServer())
        .get('/wifi')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
      const token = faker.lorem.word();
      await request(app.getHttpServer())
        .get('/wifi')
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should respond with status 200 and with Wifis data', async () => {
      const bodyLogin = new BodyLogin().generate();
      const user = await new RegisterFactory(prisma)
        .withEmail(bodyLogin.email)
        .withPassword(bodyLogin.password)
        .persist();

      const { body } = await login(app, bodyLogin);

      const WifiBody = new BodyWifi().generate();
      await new WifisFactory(prisma)
        .withBodyWifi(WifiBody)
        .withUserId(user.id)
        .persist();

      const response = await request(app.getHttpServer())
        .get('/wifi')
        .set('Authorization', `Bearer ${body.token}`)
        .expect(HttpStatus.OK);

      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            userId: user.id,
            title: WifiBody.title,
            name: WifiBody.name,
            password: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          }),
        ]),
      );
    });
  });

  describe('/wifi/:id (GET)', () => {
    it('should respond with status 401 if no token is given', async () => {
      await request(app.getHttpServer())
        .get('/wifi/1')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
      const token = faker.lorem.word();
      await request(app.getHttpServer())
        .get('/wifi/1')
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should respond with status 400 if :id not positive integer', async () => {
      const bodyLogin = new BodyLogin().generate();
      await new RegisterFactory(prisma)
        .withEmail(bodyLogin.email)
        .withPassword(bodyLogin.password)
        .persist();

      const { body } = await login(app, bodyLogin);

      await request(app.getHttpServer())
        .get('/wifi/a')
        .set('Authorization', `Bearer ${body.token}`)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should respond with status 400 if :id not positive integer', async () => {
      const bodyLogin = new BodyLogin().generate();
      await new RegisterFactory(prisma)
        .withEmail(bodyLogin.email)
        .withPassword(bodyLogin.password)
        .persist();

      const { body } = await login(app, bodyLogin);

      await request(app.getHttpServer())
        .get('/wifi/-1')
        .set('Authorization', `Bearer ${body.token}`)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should respond with status 404 if there is no Wifi for the submitted id', async () => {
      const bodyLogin = new BodyLogin().generate();
      await new RegisterFactory(prisma)
        .withEmail(bodyLogin.email)
        .withPassword(bodyLogin.password)
        .persist();

      const { body } = await login(app, bodyLogin);

      await request(app.getHttpServer())
        .get('/wifi/1')
        .set('Authorization', `Bearer ${body.token}`)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should respond with status 403 if Wifis belongs to another user', async () => {
      const creatorBodyLogin = new BodyLogin().generate();
      const creatorUser = await new RegisterFactory(prisma)
        .withEmail(creatorBodyLogin.email)
        .withPassword(creatorBodyLogin.password)
        .persist();

      const wifiBody = new BodyWifi().generate();
      const wifi = await new WifisFactory(prisma)
        .withBodyWifi(wifiBody)
        .withUserId(creatorUser.id)
        .persist();

      const bodyLogin = new BodyLogin().generate();
      await new RegisterFactory(prisma)
        .withEmail(bodyLogin.email)
        .withPassword(bodyLogin.password)
        .persist();

      const { body } = await login(app, bodyLogin);
      await request(app.getHttpServer())
        .get(`/wifi/${wifi.id}`)
        .set('Authorization', `Bearer ${body.token}`)
        .expect(HttpStatus.FORBIDDEN);
    });

    it('should respond with status 200 and Wifi data', async () => {
      const bodyLogin = new BodyLogin().generate();
      const user = await new RegisterFactory(prisma)
        .withEmail(bodyLogin.email)
        .withPassword(bodyLogin.password)
        .persist();

      const wifiBody = new BodyWifi().generate();
      const wifi = await new WifisFactory(prisma)
        .withBodyWifi(wifiBody)
        .withUserId(user.id)
        .persist();

      const { body } = await login(app, bodyLogin);

      const response = await request(app.getHttpServer())
        .get(`/wifi/${wifi.id}`)
        .set('Authorization', `Bearer ${body.token}`)
        .expect(HttpStatus.OK);

      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            userId: user.id,
            title: wifiBody.title,
            name: wifiBody.name,
            password: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          }),
        ]),
      );
    });
  });

  describe('/wifi/:id (DELETE)', () => {
    it('should respond with status 401 if no token is given', async () => {
      await request(app.getHttpServer())
        .delete('/wifi/1')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
      const token = faker.lorem.word();
      await request(app.getHttpServer())
        .delete('/wifi/1')
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should respond with status 400 if :id not positive integer', async () => {
      const bodyLogin = new BodyLogin().generate();
      await new RegisterFactory(prisma)
        .withEmail(bodyLogin.email)
        .withPassword(bodyLogin.password)
        .persist();

      const { body } = await login(app, bodyLogin);

      await request(app.getHttpServer())
        .delete('/wifi/a')
        .set('Authorization', `Bearer ${body.token}`)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should respond with status 400 if :id not positive integer', async () => {
      const bodyLogin = new BodyLogin().generate();
      await new RegisterFactory(prisma)
        .withEmail(bodyLogin.email)
        .withPassword(bodyLogin.password)
        .persist();

      const { body } = await login(app, bodyLogin);

      await request(app.getHttpServer())
        .delete('/wifi/-1')
        .set('Authorization', `Bearer ${body.token}`)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should respond with status 404 if there is no Wifi for the submitted id', async () => {
      const bodyLogin = new BodyLogin().generate();
      await new RegisterFactory(prisma)
        .withEmail(bodyLogin.email)
        .withPassword(bodyLogin.password)
        .persist();

      const { body } = await login(app, bodyLogin);

      await request(app.getHttpServer())
        .delete('/wifi/1')
        .set('Authorization', `Bearer ${body.token}`)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should respond with status 403 if Wifi belongs to another user', async () => {
      const creatorBodyLogin = new BodyLogin().generate();
      const creatorUser = await new RegisterFactory(prisma)
        .withEmail(creatorBodyLogin.email)
        .withPassword(creatorBodyLogin.password)
        .persist();

      const wifiBody = new BodyWifi().generate();
      const wifi = await new WifisFactory(prisma)
        .withBodyWifi(wifiBody)
        .withUserId(creatorUser.id)
        .persist();

      const bodyLogin = new BodyLogin().generate();
      await new RegisterFactory(prisma)
        .withEmail(bodyLogin.email)
        .withPassword(bodyLogin.password)
        .persist();

      const { body } = await login(app, bodyLogin);

      await request(app.getHttpServer())
        .delete(`/wifi/${wifi.id}`)
        .set('Authorization', `Bearer ${body.token}`)
        .expect(HttpStatus.FORBIDDEN);
    });

    it('should respond with status 200 and delete wifi data', async () => {
      const bodyLogin = new BodyLogin().generate();
      const user = await new RegisterFactory(prisma)
        .withEmail(bodyLogin.email)
        .withPassword(bodyLogin.password)
        .persist();

      const wifiBody = new BodyWifi().generate();
      const wifi = await new WifisFactory(prisma)
        .withBodyWifi(wifiBody)
        .withUserId(user.id)
        .persist();

      const { body } = await login(app, bodyLogin);
      await request(app.getHttpServer())
        .delete(`/wifi/${wifi.id}`)
        .set('Authorization', `Bearer ${body.token}`)
        .expect(HttpStatus.OK);

      await request(app.getHttpServer())
        .get(`/wifi/${wifi.id}`)
        .set('Authorization', `Bearer ${body.token}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
