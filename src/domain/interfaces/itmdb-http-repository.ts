import {
  GetMostPopularMoviesDTO,
  ResponseGetMostPopularMoviesDTO,
} from 'src/infra/http/tmdb/dto/get-most-popular-movies-dto';

export interface ItmdbHttpRepository {
  getMostPopularMovies(
    params: GetMostPopularMoviesDTO,
  ): Promise<ResponseGetMostPopularMoviesDTO>;
}
