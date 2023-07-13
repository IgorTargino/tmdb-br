import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Movie } from 'src/domain/entities/movie';
import { MovieRepository } from 'src/domain/repositories/movie.repository';

@Injectable()
export class LikeMovieService {
  constructor(
    @Inject('MovieRepository')
    private readonly movieRepository: MovieRepository,
    private readonly logger: Logger,
  ) {
    this.logger = new Logger(LikeMovieService.name);
  }
  async execute(movie: Movie) {
    try {
      if (movie.id) {
        const movieInDb = await this.movieRepository.findMovieById(movie.id);

        return await this.movieRepository.addLike(movieInDb.id);
      }

      let movieInDb = await this.movieRepository.findMovieByTitle(movie.title);

      if (!movieInDb) {
        movieInDb = await this.movieRepository.createMovie({
          ...movie,
          likes: 1,
        });
      } else {
        movieInDb = await this.movieRepository.addLike(movieInDb.id);
      }

      return movieInDb;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
