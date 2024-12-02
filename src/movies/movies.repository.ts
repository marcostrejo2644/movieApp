import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie, MovieDocument } from '@movies/model/movie.schema';
import { IMovie } from '@movies/interfaces/movie.interface';

@Injectable()
export class MoviesRepository {
  constructor(
    @InjectModel(Movie.name) private readonly movieModel: Model<MovieDocument>,
  ) {}

  async create(movieData: Partial<IMovie>): Promise<Movie> {
    const newMovie = new this.movieModel(movieData);
    return await newMovie.save();
  }

  async findAll(): Promise<Movie[]> {
    return await this.movieModel.find().exec();
  }

  async findById(id: string): Promise<Movie | null> {
    return await this.movieModel.findById(id).exec();
  }

  async updateById(
    id: string,
    updateData: Partial<IMovie>,
  ): Promise<Movie | null> {
    return await this.movieModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async deleteById(id: string): Promise<Movie | null> {
    return await this.movieModel.findByIdAndDelete(id).exec();
  }
}
