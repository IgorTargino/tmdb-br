import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { MovieRepository } from 'src/domain/repositories/movie.repository';

@Injectable()
export class DeslikeMovieService {
  constructor(
    @Inject('MovieRepository')
    private readonly movieRepository: MovieRepository,
    private readonly logger: Logger,
  ) {
    this.logger = new Logger(DeslikeMovieService.name);
  }
  async execute(movieId: string) {
    try {
      console.log(movieId);
      const movie = await this.movieRepository.findMovieById(movieId);

      if (!movie) {
        throw new HttpException('Movie not found', 400);
      }

      if (movie.likes === 0) {
        throw new HttpException('Movie already has 0 likes', 400);
      }

      const movieInDb = await this.movieRepository.removeLike(movieId);

      return movieInDb;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
