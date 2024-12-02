import axios from 'axios';
import { MoviesService } from '@movies/movies.service';
import { ICharacter, IMovie } from '@src/movies/interfaces/movie.interface';
import { Genre } from '@src/movies/model/movie.dto';

export const syncStarWarsMovies = async (movieService: MoviesService) => {
  try {
    const response = await axios.get('https://swapi.dev/api/films/');
    const movies = response.data.results;

    const moviePromises = movies.map(async (movie) => {
      const characterPromises = movie.characters.map(
        async (characterUrl: string) => {
          let retries = 3;
          while (retries > 0) {
            try {
              const responseCharacter: any = await axios.get(characterUrl);
              if (
                responseCharacter.data.name &&
                responseCharacter.data.gender
              ) {
                return {
                  character: responseCharacter.data.name,
                  gender: responseCharacter.data.gender,
                  actor: responseCharacter.data.actor ?? '',
                };
              }
              break;
            } catch (error) {
              retries -= 1;
              return null;
            }
          }
          return null;
        },
      );

      const charactersResults = await Promise.allSettled(characterPromises);
      const characters: ICharacter[] = charactersResults
        .filter(
          (result) => result.status === 'fulfilled' && result.value !== null,
        )
        .map((result: any) => result.value);

      const newMovie: IMovie = {
        title: movie.title,
        genre: Genre.SCIFI,
        description: movie.opening_crawl,
        director: movie.director,
        releaseDate: movie.release_date,
        characters: characters,
      };

      try {
        await movieService.createMovie(newMovie);
        return { status: 'success', movie: movie.title };
      } catch (error) {
        console.error(`Error creating movie ${movie.title}:`, error);
        return { status: 'failed', movie: movie.title };
      }
    });

    const moviesResults = await Promise.allSettled(moviePromises);

    const successfulMovies = moviesResults.filter(
      (result) =>
        result.status === 'fulfilled' && result.value?.status === 'success',
    );
    const failedMovies = moviesResults.filter(
      (result) =>
        result.status === 'fulfilled' && result.value?.status === 'failed',
    );

    console.log(`Movies synchronized successfully: ${successfulMovies.length}`);
    console.log(`Movies failed to sync: ${failedMovies.length}`);
  } catch (error) {
    console.error('Error syncing movies:', error);
    throw new Error('Failed to sync Star Wars movies');
  }
};
