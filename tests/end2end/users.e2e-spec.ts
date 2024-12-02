import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { UsersModule } from '../../src/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('Users Module (e2e)', () => {
  let app: INestApplication;
  let mongod: MongoMemoryServer;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const mongoUri = mongod.getUri();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsersModule, MongooseModule.forRoot(mongoUri)],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await mongod.stop();
  });

  describe('POST /users', () => {
    it('should create a new user', async () => {
      const newUser = {
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'Test123@',
        firstName: 'Test',
        lastName: 'User',
      };

      await request(app.getHttpServer())
        .post('/users')
        .send(newUser)
        .expect(201);
    });
    it('Error email and username already in use', async () => {
      const newUser = {
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'Test1234#',
        firstName: 'Test',
        lastName: 'User',
      };
      await request(app.getHttpServer()).post('/users').send(newUser);

      await request(app.getHttpServer())
        .post('/users')
        .send(newUser)
        .expect(409);
    });
    it('Bad request for user', async () => {
      const newUser = {
        username: 'userTest2',
        email: 'userTest2@example.com',
        password: 'badpassword',
        lastName: 'User',
      };
      const response = await request(app.getHttpServer())
        .post('/users')
        .send(newUser);

      expect(response.statusCode).toEqual(400);
    });
  });
});
