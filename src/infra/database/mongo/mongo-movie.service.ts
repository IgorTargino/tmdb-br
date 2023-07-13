import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie } from 'src/domain/entities/movie';

@Injectable()
export class MongoMovieService {
  constructor(
    @InjectModel('Movie') private readonly movieModel: Model<Movie>,
  ) {}

  async createMovie(movie: Movie): Promise<Movie> {
    const createdMovie = new this.movieModel(movie);
    return createdMovie.save();
  }

  async addLike(movieId: string): Promise<Movie> {
    return this.movieModel.findByIdAndUpdate(
      movieId,
      { $inc: { likes: 1 } },
      { new: true },
    );
  }

  async removeLike(movieId: string): Promise<Movie> {
    return this.movieModel.findByIdAndUpdate(
      movieId,
      { $inc: { likes: -1 } },
      { new: true },
    );
  }

  async findAllMovies(): Promise<Movie[]> {
    return this.movieModel.find().exec();
  }
}
