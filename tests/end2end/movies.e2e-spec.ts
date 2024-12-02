import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { MoviesModule } from '../../src/movies/movies.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { AuthModule } from '../../src/auth/auth.module';

describe('Movies Module (e2e)', () => {
  let app: INestApplication;
  let mongod: MongoMemoryServer;
  let authAdminToken: string;
  let authToken: string;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const mongoUri = mongod.getUri();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MoviesModule, AuthModule, MongooseModule.forRoot(mongoUri)],
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

    const newAdminUser = {
      username: 'testAdmin',
      email: 'testAdmin@example.com',
      password: 'Test1234#',
      firstName: 'Test',
      lastName: 'User',
    };

    const newUser = {
      username: 'testUser',
      email: 'testUser@example.com',
      password: 'Test1234#',
      firstName: 'Test',
      lastName: 'User',
    };

    await request(app.getHttpServer()).post('/users').send(newUser).expect(201);

    const response = await request(app.getHttpServer())
      .post('/users')
      .send(newAdminUser)
      .expect(201);

    const userId = response.body._id;

    const dbConnection = app.get('DatabaseConnection');
    const userModel = dbConnection.collection('users');
    await userModel.updateOne({ _id: userId }, { $set: { role: 'ADMIN' } });

    const userLoginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'testuser@example.com',
        password: 'Test1234#',
      });
    const adminLoginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'testAdmin@example.com',
        password: 'Test1234#',
      });

    authToken = userLoginResponse.body.accessToken;
    authAdminToken = adminLoginResponse.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
    await mongod.stop();
  });

  describe('GET /movies', () => {
    it('should return an array of movies', async () => {
      const response = await request(app.getHttpServer())
        .get('/movies')
        .set('Authorization', `Bearer ${authAdminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /movies', () => {
    it('should create a new movie', async () => {
      const newMovie = {
        title: 'The Matrix',
        description:
          'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
        genre: 'Sci-Fi',
        characters: [
          { name: 'Neo', actor: 'Keanu Reeves' },
          { name: 'Trinity', actor: 'Carrie-Anne Moss' },
        ],
        rating: 8.7,
        director: 'The Wachowskis',
        releaseDate: '1999-03-31T00:00:00Z',
      };

      await request(app.getHttpServer())
        .post('/movies')
        .set('Authorization', `Bearer ${authAdminToken}`)
        .send(newMovie)
        .expect(201);
    });

    it('should return 401 if user is not admin', async () => {
      const newMovie = {
        title: 'Inception',
        description:
          'A thief who steals corporate secrets through the use of dream-sharing technology is given the task of planting an idea into the mind of a CEO.',
        genre: 'Sci-Fi',
        characters: [
          { name: 'Cobb', actor: 'Leonardo DiCaprio' },
          { name: 'Ariadne', actor: 'Elliot Page' },
        ],
        rating: 8.8,
        director: 'Christopher Nolan',
        releaseDate: '2010-07-16T00:00:00Z',
      };

      const response = await request(app.getHttpServer())
        .post('/movies')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newMovie);

      expect(response.status).toEqual(401);
    });
  });

  describe('GET /movies/:id', () => {
    it('should return a movie by ID', async () => {
      const newMovie = {
        title: 'The Matrix',
        description:
          'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
        genre: 'Sci-Fi',
        characters: [
          { name: 'Neo', actor: 'Keanu Reeves' },
          { name: 'Trinity', actor: 'Carrie-Anne Moss' },
        ],
        rating: 8.7,
        director: 'The Wachowskis',
        releaseDate: '1999-03-31T00:00:00Z',
      };

      const movieResponse = await request(app.getHttpServer())
        .post('/movies')
        .set('Authorization', `Bearer ${authAdminToken}`)
        .send(newMovie)
        .expect(201);

      const movieId = movieResponse.body._id;

      const response = await request(app.getHttpServer())
        .get(`/movies/${movieId}`)
        .set('Authorization', `Bearer ${authAdminToken}`)
        .expect(200);

      expect(response.body.title).toBe(newMovie.title);
    });

    it('should return 404 if movie is not found', async () => {
      const invalidId = '123456789012345678901234';
      const response = await request(app.getHttpServer())
        .get(`/movies/${invalidId}`)
        .set('Authorization', `Bearer ${authAdminToken}`)
        .expect(404);

      expect(response.body.message).toBe(
        `Movie with ID ${invalidId} not found`,
      );
    });
  });

  describe('DELETE /movies/:id', () => {
    it('should delete a movie by ID', async () => {
      const newMovie = {
        title: 'The Matrix',
        description:
          'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
        genre: 'Sci-Fi',
        characters: [
          { name: 'Neo', actor: 'Keanu Reeves' },
          { name: 'Trinity', actor: 'Carrie-Anne Moss' },
        ],
        rating: 8.7,
        director: 'The Wachowskis',
        releaseDate: '1999-03-31T00:00:00Z',
      };

      const movieResponse = await request(app.getHttpServer())
        .post('/movies')
        .set('Authorization', `Bearer ${authAdminToken}`)
        .send(newMovie)
        .expect(201);

      const movieId = movieResponse.body._id;

      await request(app.getHttpServer())
        .delete(`/movies/${movieId}`)
        .set('Authorization', `Bearer ${authAdminToken}`)
        .expect(200);

      await request(app.getHttpServer())
        .get(`/movies/${movieId}`)
        .set('Authorization', `Bearer ${authAdminToken}`)
        .expect(404);
    });
  });
});
