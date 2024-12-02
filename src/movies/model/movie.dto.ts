import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  Min,
  Max,
  IsMongoId,
  IsArray,
} from 'class-validator';
import { Exclude } from 'class-transformer';
import {
  ICharacter,
  IMovie,
  IUpdateMovie,
} from '@movies/interfaces/movie.interface';
import { ApiProperty } from '@nestjs/swagger';

export enum Genre {
  ACTION = 'Action',
  DRAMA = 'Drama',
  COMEDY = 'Comedy',
  HORROR = 'Horror',
  SCIFI = 'Sci-Fi',
  ROMANCE = 'Romance',
  FANTASY = 'Fantasy',
}

export class CreateMovieDTO implements IMovie {
  @ApiProperty({
    description: 'The title of the movie',
    example: 'The Shawshank Redemption',
  })
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title must not be empty' })
  title: string;

  @ApiProperty({
    description: 'A brief description of the movie',
    example:
      'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    required: false,
  })
  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'The genre of the movie',
    enum: Genre,
    example: Genre.DRAMA,
  })
  @IsEnum(Genre, { message: 'Invalid genre' })
  @IsNotEmpty({ message: 'Genre must not be empty' })
  genre: Genre;

  @ApiProperty({
    description: 'A list of characters in the movie',
    type: [Object],
    example: [
      {
        name: 'Andy Dufresne',
        actor: 'Tim Robbins',
      },
      {
        name: 'Ellis Redding',
        actor: 'Morgan Freeman',
      },
    ],
  })
  @IsNotEmpty({ message: 'Character must be empty' })
  @IsArray({ message: 'Character must be an array' })
  characters: ICharacter[];

  @ApiProperty({
    description: 'The rating of the movie (0 to 10)',
    example: 9.3,
  })
  @IsNumber({}, { message: 'Rating must be a number' })
  @Min(0, { message: 'Rating must be at least 0' })
  @Max(10, { message: 'Rating must be at most 10' })
  rating: number;

  @ApiProperty({
    description: 'The director of the movie',
    example: 'Frank Darabont',
    required: false,
  })
  @IsString({ message: 'Director must be a string' })
  @IsOptional()
  director?: string;

  @ApiProperty({
    description: 'The release date of the movie',
    example: '1994-09-22T00:00:00Z',
    required: false,
  })
  @IsString({ message: 'Release date must be a valid date string' })
  @IsOptional()
  releaseDate: Date;
}

export class UpdateMovieDTO implements Partial<IUpdateMovie> {
  @ApiProperty({
    description: 'The title of the movie (optional)',
    example: 'The Dark Knight',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Title must be a string' })
  title?: string;

  @ApiProperty({
    description: 'A brief description of the movie (optional)',
    example: 'Batman faces the Joker in Gotham City',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @ApiProperty({
    description: 'The genre of the movie (optional)',
    enum: Genre,
    example: Genre.ACTION,
    required: false,
  })
  @IsOptional()
  @IsEnum(Genre, { message: 'Invalid genre' })
  genre?: Genre;

  @ApiProperty({
    description: 'The rating of the movie (optional)',
    example: 9.0,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Rating must be a number' })
  @Min(0, { message: 'Rating must be at least 0' })
  @Max(10, { message: 'Rating must be at most 10' })
  rating?: number;

  @ApiProperty({
    description: 'The director of the movie (optional)',
    example: 'Christopher Nolan',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Director must be a string' })
  director?: string;

  @ApiProperty({
    description: 'The release date of the movie (optional)',
    example: '2008-07-18T00:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Release date must be a valid date string' })
  releaseDate?: Date;

  @Exclude()
  id?: string;
}
