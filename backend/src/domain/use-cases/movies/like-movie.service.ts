import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { MovieRepository } from 'src/domain/repositories/movie.repository';
import { LikeMovieDto } from 'src/infra/http/controllers/dto/like-movie.dto';

@Injectable()
export class LikeMovieService {
  constructor(
    @Inject('MovieRepository')
    private readonly movieRepository: MovieRepository,
    private readonly logger: Logger,
  ) {
    this.logger = new Logger(LikeMovieService.name);
  }
  async execute(movie: LikeMovieDto) {
    try {
      if (movie.movieId) {
        const movieInDb = await this.movieRepository.findMovieById(
          movie.movieId,
        );

        return await this.movieRepository.addLike(movieInDb.id);
      }

      const movieForTmdb = movie.title && movie.overview && movie.poster_path;

      if (!movieForTmdb) throw new HttpException('Movie data is invalid', 400);

      return this.movieRepository.createMovie({ ...movie, likes: 1 });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
