import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MoviesService } from '@movies/movies.service';
import { MoviesController } from '@movies/movies.controller';
import { MoviesRepository } from '@movies/movies.repository';
import { Movie, MovieSchema } from '@movies/model/movie.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]),
  ],
  providers: [MoviesService, MoviesRepository],
  controllers: [MoviesController],
})
export class MoviesModule {}
