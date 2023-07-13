import { Injectable } from '@nestjs/common';
import { HttpClientService } from '../../http-client/http-client.service';
import { TmdbConfigProvider } from '../providers/tmdb-config-provider';
import {
  GetMostPopularMoviesDTO,
  ResponseGetMostPopularMoviesDTO,
} from '../dto/get-most-popular-movies-dto';

@Injectable()
export class TmdbHttpRepository {
  constructor(
    private readonly httpClientService: HttpClientService,
    private readonly tmdbProvider: TmdbConfigProvider,
  ) {}

  async getMostPopularMovies({
    language,
    region,
    page,
  }: GetMostPopularMoviesDTO): Promise<ResponseGetMostPopularMoviesDTO> {
    const config = await this.tmdbProvider.getConfig();
    let url = `/movie/popular`;

    language && (url += `?language=${language}`);
    region && (url += `&region=${region}`);
    page && (url += `&page=${page}`);

    const response =
      await this.httpClientService.get<ResponseGetMostPopularMoviesDTO>(
        url,
        config,
      );

    return response;
  }
}
