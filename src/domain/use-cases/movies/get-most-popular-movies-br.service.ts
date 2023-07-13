import { Inject, Injectable, Logger } from '@nestjs/common';
import { Movie } from 'src/domain/entities/movie';
import { MovieRepository } from 'src/domain/repositories/movie.repository';
import { TmdbHttpRepository } from 'src/domain/repositories/tmdb-http.repository';

@Injectable()
export class GetMostPopularMoviesBrService {
  constructor(
    @Inject('TmdbHttpRepository')
    private readonly tmdbHttpRepository: TmdbHttpRepository,
    @Inject('MovieRepository')
    private readonly movieRepository: MovieRepository,
    private readonly logger: Logger,
  ) {
    this.logger = new Logger(GetMostPopularMoviesBrService.name);
  }

  async execute(limit?: number): Promise<Movie[]> {
    try {
      const response = await this.tmdbHttpRepository.getMostPopularMovies({
        language: 'pt-BR',
        region: 'BR',
      });

      const movieList = response.results.slice(0, limit).map((movie): Movie => {
        const movieData = {
          title: movie.title,
          overview: movie.overview,
          poster_path: movie.poster_path,
        };

        this.movieRepository.createMovie(movieData);

        return movieData;
      });

      return movieList;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
