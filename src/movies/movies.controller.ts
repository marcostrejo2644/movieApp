import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDTO, UpdateMovieDTO } from '@movies/model/movie.dto';
import { Movie } from '@movies/model/movie.schema';
import { AuthGuard } from '@src/auth/guards/auth.guard';
import { AdminAccess } from '@src/auth/decorators/admin.decorator';
import { syncStarWarsMovies } from '@src/utils/starWars.sync';
import { IdParamDTO } from '@src/shared/mongoId.dto';
import { ApiTags, ApiResponse, ApiOperation, ApiParam } from '@nestjs/swagger';

@ApiTags('Movies')
@Controller('movies')
@UseGuards(AuthGuard)
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @AdminAccess()
  @ApiOperation({ summary: 'Create a new movie' })
  @ApiResponse({
    status: 201,
    description: 'The movie has been successfully created.',
    type: Movie,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data.',
  })
  async createMovie(@Body() createMovieDto: CreateMovieDTO): Promise<Movie> {
    return this.moviesService.createMovie(createMovieDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all movies' })
  @ApiResponse({
    status: 200,
    description: 'List of all movies.',
    type: [Movie],
  })
  async getAllMovies(): Promise<Movie[]> {
    return this.moviesService.getAllMovies();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a movie by ID' })
  @ApiParam({
    name: 'movieId',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'The movie has been found.',
    type: Movie,
    schema: {
      example: {
        title: 'The Shawshank Redemption',
        description:
          'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
        genre: 'Drama',
        characters: [
          {
            name: 'Andy Dufresne',
            actor: 'Tim Robbins',
          },
          {
            name: 'Ellis Redding',
            actor: 'Morgan Freeman',
          },
        ],
        rating: 9.3,
        director: 'Frank Darabont',
        releaseDate: '1994-09-22T00:00:00Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Movie not found.',
  })
  async getMovieById(@Param() param: IdParamDTO): Promise<Movie> {
    const id = param.id;
    const movie = await this.moviesService.getMovieById(id);
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    return movie;
  }

  @Put(':id')
  @ApiParam({
    name: 'movieId',
    type: 'string',
  })
  @AdminAccess()
  @ApiOperation({ summary: 'Update a movie by ID' })
  @ApiParam({
    name: 'movieId',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'The movie has been successfully updated.',
    type: Movie,
  })
  @ApiResponse({
    status: 404,
    description: 'Movie not found.',
  })
  async updateMovie(
    @Param() params: IdParamDTO,
    @Body() updateMovieDto: UpdateMovieDTO,
  ): Promise<Movie> {
    const id = params.id;
    const updatedMovie = await this.moviesService.updateMovie(
      id,
      updateMovieDto,
    );
    if (!updatedMovie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    return updatedMovie;
  }

  @Delete(':id')
  @AdminAccess()
  @ApiOperation({ summary: 'Delete a movie by ID' })
  @ApiParam({
    name: 'movieId',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'The movie has been successfully deleted.',
    schema: {
      example: { message: 'Movie deleted successfully' },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Movie not found.',
  })
  async deleteMovie(@Param() params: IdParamDTO): Promise<{ message: string }> {
    const id = params.id;
    const deleted = await this.moviesService.deleteMovie(id);
    if (!deleted) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    return { message: 'Movie deleted successfully' };
  }

  @Post('sync-star-wars')
  @AdminAccess()
  @ApiOperation({ summary: 'Sync Star Wars movies into the database' })
  @ApiResponse({
    status: 200,
    description: 'Star Wars movies synced successfully.',
  })
  async syncStarWars() {
    return await syncStarWarsMovies(this.moviesService);
  }
}
