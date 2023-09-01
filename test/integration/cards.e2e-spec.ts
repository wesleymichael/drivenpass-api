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
import { BodyCard } from '../factories/cards.body';
import { faker } from '@faker-js/faker';
import { CardsFactory } from '../factories/cards.factory';

describe('cardsController (e2e)', () => {
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

  describe('/cards (POST)', () => {
    it('should respond with status 401 if no token is given', async () => {
      const bodyCards = new BodyCard().generate();
      await request(app.getHttpServer())
        .post('/cards')
        .send(bodyCards)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
      const token = faker.lorem.word();
      const bodyCards = new BodyCard().generate();
      await request(app.getHttpServer())
        .post('/cards')
        .send(bodyCards)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should respond with status 409 when title already exist', async () => {
      const bodyLogin = new BodyLogin().generate();
      await new RegisterFactory(prisma)
        .withEmail(bodyLogin.email)
        .withPassword(bodyLogin.password)
        .persist();
      const { body } = await login(app, bodyLogin);
      const bodyCard1 = new BodyCard().generate();
      const bodyCard2 = new BodyCard().generate();
      await request(app.getHttpServer())
        .post('/cards')
        .send(bodyCard1)
        .set('Authorization', `Bearer ${body.token}`);
      return await request(app.getHttpServer())
        .post('/cards')
        .send({ ...bodyCard2, title: bodyCard1.title })
        .set('Authorization', `Bearer ${body.token}`)
        .expect(HttpStatus.CONFLICT);
    });

    it('should respond with status 409 when card number already exist', async () => {
      const bodyLogin = new BodyLogin().generate();
      await new RegisterFactory(prisma)
        .withEmail(bodyLogin.email)
        .withPassword(bodyLogin.password)
        .persist();
      const { body } = await login(app, bodyLogin);
      const bodyCard1 = new BodyCard().generate();
      const bodyCard2 = new BodyCard().generate();
      await request(app.getHttpServer())
        .post('/cards')
        .send(bodyCard1)
        .set('Authorization', `Bearer ${body.token}`);
      return await request(app.getHttpServer())
        .post('/cards')
        .send({ ...bodyCard2, number: bodyCard1.number })
        .set('Authorization', `Bearer ${body.token}`)
        .expect(HttpStatus.CONFLICT);
    });

    it('should create a card', async () => {
      const bodyLogin = new BodyLogin().generate();
      await new RegisterFactory(prisma)
        .withEmail(bodyLogin.email)
        .withPassword(bodyLogin.password)
        .persist();
      const { body } = await login(app, bodyLogin);
      const bodyCard = new BodyCard().generate();
      await request(app.getHttpServer())
        .post('/cards')
        .send(bodyCard)
        .set('Authorization', `Bearer ${body.token}`)
        .expect(HttpStatus.CREATED);
    });
  });

  describe('/cards (GET)', () => {
    it('should respond with status 401 if no token is given', async () => {
      await request(app.getHttpServer())
        .get('/cards')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
      const token = faker.lorem.word();
      await request(app.getHttpServer())
        .get('/cards')
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should respond with status 200 and with cards data', async () => {
      const bodyLogin = new BodyLogin().generate();
      const user = await new RegisterFactory(prisma)
        .withEmail(bodyLogin.email)
        .withPassword(bodyLogin.password)
        .persist();
      const { body } = await login(app, bodyLogin);
      const cardBody = new BodyCard().generate();
      await new CardsFactory(prisma)
        .withBodyCard(cardBody)
        .withUserId(user.id)
        .persist();
      const response = await request(app.getHttpServer())
        .get('/cards')
        .set('Authorization', `Bearer ${body.token}`)
        .expect(HttpStatus.OK);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            userId: user.id,
            title: cardBody.title,
            number: cardBody.number,
            name: cardBody.name,
            cvv: expect.any(String),
            exp: cardBody.exp,
            password: expect.any(String),
            isVirtual: cardBody.isVirtual,
            isCredit: cardBody.isCredit,
            isDebit: cardBody.isDebit,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          }),
        ]),
      );
    });
  });

  describe('/cards/:id (GET)', () => {
    it('should respond with status 401 if no token is given', async () => {
      await request(app.getHttpServer())
        .get('/cards/1')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
      const token = faker.lorem.word();
      await request(app.getHttpServer())
        .get('/cards/1')
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
        .get('/cards/a')
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
        .get('/cards/-1')
        .set('Authorization', `Bearer ${body.token}`)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should respond with status 404 if there is no card for the submitted id', async () => {
      const bodyLogin = new BodyLogin().generate();
      await new RegisterFactory(prisma)
        .withEmail(bodyLogin.email)
        .withPassword(bodyLogin.password)
        .persist();
      const { body } = await login(app, bodyLogin);
      await request(app.getHttpServer())
        .get('/cards/1')
        .set('Authorization', `Bearer ${body.token}`)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should respond with status 403 if card belongs to another user', async () => {
      //Criar um user e criar um card para esse user
      const creatorBodyLogin = new BodyLogin().generate();
      const creatorUser = await new RegisterFactory(prisma)
        .withEmail(creatorBodyLogin.email)
        .withPassword(creatorBodyLogin.password)
        .persist();
      const cardBody = new BodyCard().generate();
      const card = await new CardsFactory(prisma)
        .withBodyCard(cardBody)
        .withUserId(creatorUser.id)
        .persist();
      //Criar um novo user e gerar o token, buscando pelo id do card criado pelo user anterior
      const bodyLogin = new BodyLogin().generate();
      await new RegisterFactory(prisma)
        .withEmail(bodyLogin.email)
        .withPassword(bodyLogin.password)
        .persist();
      const { body } = await login(app, bodyLogin);
      await request(app.getHttpServer())
        .get(`/cards/${card.id}`)
        .set('Authorization', `Bearer ${body.token}`)
        .expect(HttpStatus.FORBIDDEN);
    });

    it('should respond with status 200 and card data', async () => {
      const bodyLogin = new BodyLogin().generate();
      const user = await new RegisterFactory(prisma)
        .withEmail(bodyLogin.email)
        .withPassword(bodyLogin.password)
        .persist();
      const cardBody = new BodyCard().generate();
      const card = await new CardsFactory(prisma)
        .withBodyCard(cardBody)
        .withUserId(user.id)
        .persist();
      const { body } = await login(app, bodyLogin);
      const response = await request(app.getHttpServer())
        .get(`/cards/${card.id}`)
        .set('Authorization', `Bearer ${body.token}`)
        .expect(HttpStatus.OK);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            userId: user.id,
            title: cardBody.title,
            number: cardBody.number,
            name: cardBody.name,
            cvv: expect.any(String),
            exp: cardBody.exp,
            password: expect.any(String),
            isVirtual: cardBody.isVirtual,
            isCredit: cardBody.isCredit,
            isDebit: cardBody.isDebit,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          }),
        ]),
      );
    });
  });

  describe('/cards/:id (DELETE)', () => {
    it('should respond with status 401 if no token is given', async () => {
      await request(app.getHttpServer())
        .delete('/cards/1')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
      const token = faker.lorem.word();
      await request(app.getHttpServer())
        .delete('/cards/1')
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
        .delete('/cards/a')
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
        .delete('/cards/-1')
        .set('Authorization', `Bearer ${body.token}`)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should respond with status 404 if there is no card for the submitted id', async () => {
      const bodyLogin = new BodyLogin().generate();
      await new RegisterFactory(prisma)
        .withEmail(bodyLogin.email)
        .withPassword(bodyLogin.password)
        .persist();
      const { body } = await login(app, bodyLogin);
      await request(app.getHttpServer())
        .delete('/cards/1')
        .set('Authorization', `Bearer ${body.token}`)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should respond with status 403 if card belongs to another user', async () => {
      //Criar um user e um card para esse user
      const creatorBodyLogin = new BodyLogin().generate();
      const creatorUser = await new RegisterFactory(prisma)
        .withEmail(creatorBodyLogin.email)
        .withPassword(creatorBodyLogin.password)
        .persist();

      const cardBody = new BodyCard().generate();
      const card = await new CardsFactory(prisma)
        .withBodyCard(cardBody)
        .withUserId(creatorUser.id)
        .persist();

      //Criar um novo user e gerar o token, buscando pelo id do card criado pelo user anterior
      const bodyLogin = new BodyLogin().generate();
      await new RegisterFactory(prisma)
        .withEmail(bodyLogin.email)
        .withPassword(bodyLogin.password)
        .persist();

      const { body } = await login(app, bodyLogin);
      await request(app.getHttpServer())
        .delete(`/cards/${card.id}`)
        .set('Authorization', `Bearer ${body.token}`)
        .expect(HttpStatus.FORBIDDEN);
    });

    it('should respond with status 200 and delete card data', async () => {
      const bodyLogin = new BodyLogin().generate();
      const user = await new RegisterFactory(prisma)
        .withEmail(bodyLogin.email)
        .withPassword(bodyLogin.password)
        .persist();

      const cardBody = new BodyCard().generate();
      const card = await new CardsFactory(prisma)
        .withBodyCard(cardBody)
        .withUserId(user.id)
        .persist();

      const { body } = await login(app, bodyLogin);
      await request(app.getHttpServer())
        .delete(`/cards/${card.id}`)
        .set('Authorization', `Bearer ${body.token}`)
        .expect(HttpStatus.OK);

      await request(app.getHttpServer())
        .get(`/cards/${card.id}`)
        .set('Authorization', `Bearer ${body.token}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
