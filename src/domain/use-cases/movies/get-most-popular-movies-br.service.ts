import { Inject, Injectable, Logger } from '@nestjs/common';
import { Movie } from 'src/domain/entities/movie';
import { TmdbHttpRepository } from 'src/domain/repositories/tmdb-http.repository';

@Injectable()
export class GetMostPopularMoviesBrService {
  constructor(
    @Inject('TmdbHttpRepository')
    private readonly tmdbHttpRepository: TmdbHttpRepository,
    private readonly logger: Logger,
  ) {
    this.logger = new Logger(GetMostPopularMoviesBrService.name);
  }

  async execute(limit: number): Promise<Movie[]> {
    try {
      const response = await this.tmdbHttpRepository.getMostPopularMovies({
        language: 'pt-BR',
        region: 'BR',
      });

      const movieList = response.results.slice(0, limit).map((movie): Movie => {
        return {
          id: movie.id,
          title: movie.title,
          overview: movie.overview,
          poster_path: movie.poster_path,
        };
      });

      return movieList;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
