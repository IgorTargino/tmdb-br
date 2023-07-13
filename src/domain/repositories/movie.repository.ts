import { Movie } from '../entities/movie';

export abstract class MovieRepository {
  abstract createMovie(movie: any): Promise<Movie>;
  abstract addLike(movieId: string): Promise<Movie>;
  abstract removeLike(movieId: string): Promise<Movie>;
  abstract findAllMovies(): Promise<Movie[]>;
}
