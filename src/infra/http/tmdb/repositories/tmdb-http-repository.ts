import { Injectable } from '@nestjs/common';
import { HttpClientService } from '../../http-client/http-client.service';
import { TmdbConfigProvider } from '../providers/tmdb-config-provider';
import {
  GetMostPopularMoviesDto,
  ResponseGetMostPopularMoviesDto,
} from '../dtos/get-most-popular-movies-dto';

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
  }: GetMostPopularMoviesDto): Promise<ResponseGetMostPopularMoviesDto> {
    const config = await this.tmdbProvider.getConfig();
    let url = `/movie/popular`;

    language && (url += `?language=${language}`);
    region && (url += `&region=${region}`);
    page && (url += `&page=${page}`);

    const response =
      await this.httpClientService.get<ResponseGetMostPopularMoviesDto>(
        url,
        config,
      );

    return response;
  }
}
