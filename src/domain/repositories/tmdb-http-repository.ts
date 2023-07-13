import {
  GetMostPopularMoviesDTO,
  ResponseGetMostPopularMoviesDTO,
} from 'src/infra/http/tmdb/dto/get-most-popular-movies-dto';

export abstract class TmdbHttpRepository {
  abstract getMostPopularMovies(
    params: GetMostPopularMoviesDTO,
  ): Promise<ResponseGetMostPopularMoviesDTO>;
}
