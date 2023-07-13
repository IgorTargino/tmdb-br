import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie } from 'src/domain/entities/movie';

@Injectable()
export class MongoMovieService {
  constructor(
    @InjectModel('Movie') private readonly movieModel: Model<Movie>,
    private readonly logger: Logger,
  ) {
    this.logger = new Logger(MongoMovieService.name);
  }

  async createMovie(movie: Movie): Promise<Movie> {
    this.logger.debug(`Creating movie ${movie.title}`);

    const movieExists = this.findMovieByTitle(movie.title);

    if (movieExists) {
      this.logger.debug(`Movie ${movie.title} already exists`);
      return;
    }

    const createdMovie = new this.movieModel(movie);
    return createdMovie.save();
  }

  async addLike(movieId: string): Promise<Movie> {
    this.logger.debug(`Adding like to movie ${movieId}`);
    return this.movieModel.findByIdAndUpdate(
      movieId,
      { $inc: { likes: 1 } },
      { new: true },
    );
  }

  async removeLike(movieId: string): Promise<Movie> {
    this.logger.debug(`Removing like to movie ${movieId}`);
    return this.movieModel.findByIdAndUpdate(
      movieId,
      { $inc: { likes: -1 } },
      { new: true },
    );
  }

  async findMovieById(movieId: string): Promise<Movie> {
    this.logger.debug(`Finding movie by id ${movieId}`);
    return this.movieModel.findById(movieId).exec();
  }

  async findMovieByTitle(title: string): Promise<Movie> {
    this.logger.debug(`Finding movie by title ${title}`);
    return this.movieModel.findOne({ title }).exec();
  }

  async findAllMovies(): Promise<Movie[]> {
    this.logger.debug(`Finding all movies`);
    return this.movieModel.find().exec();
  }
}
