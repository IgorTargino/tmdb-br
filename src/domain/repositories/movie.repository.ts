import { Movie } from '../entities/movie';

export abstract class MovieRepository {
  abstract createMovie(movie: Movie): Promise<Movie>;
  abstract addLike(movieId: string): Promise<Movie>;
  abstract removeLike(movieId: string): Promise<Movie>;
  abstract findMovieById(movieId: string): Promise<Movie>;
  abstract findMovieByTitle(title: string): Promise<Movie>;
  abstract findAllMovies(): Promise<Movie[]>;
}
