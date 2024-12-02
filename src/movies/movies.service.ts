import { Injectable } from '@nestjs/common';
import { MoviesRepository } from './movies.repository';
import { Movie } from '@movies/model/movie.schema';
import { IMovie } from '@movies/interfaces/movie.interface';

@Injectable()
export class MoviesService {
  constructor(private readonly moviesRepository: MoviesRepository) {}

  async createMovie(movieData: Partial<IMovie>): Promise<Movie> {
    return this.moviesRepository.create(movieData);
  }

  async getAllMovies(): Promise<Movie[]> {
    return this.moviesRepository.findAll();
  }

  async getMovieById(id: string): Promise<Movie | null> {
    return this.moviesRepository.findById(id);
  }

  async updateMovie(
    id: string,
    updateData: Partial<IMovie>,
  ): Promise<Movie | null> {
    return this.moviesRepository.updateById(id, updateData);
  }

  async deleteMovie(id: string): Promise<Movie | null> {
    return this.moviesRepository.deleteById(id);
  }
}
