import { Inject, Logger } from '@nestjs/common';
import { MovieRepository } from 'src/domain/repositories/movie.repository';

export class GetMostLikedMoviesBrService {
  constructor(
    @Inject('MovieRepository')
    private readonly movieRepository: MovieRepository,
    private readonly logger: Logger,
  ) {}
  async execute(limit?: number) {
    try {
      const movies = (await this.movieRepository.findAllMovies())
        .slice(0, limit)
        .sort((a, b) => b.likes - a.likes);

      return movies;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
