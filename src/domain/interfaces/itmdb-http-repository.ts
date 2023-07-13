import {
  GetMostPopularMoviesDto,
  ResponseGetMostPopularMoviesDto,
} from 'src/infra/http/tmdb/dtos/get-most-popular-movies-dto';

export interface ItmdbHttpRepository {
  getMostPopularMovies(
    params: GetMostPopularMoviesDto,
  ): Promise<ResponseGetMostPopularMoviesDto>;
}
