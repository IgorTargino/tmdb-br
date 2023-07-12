import { Injectable } from '@nestjs/common';
import { HttpClientService } from '../../http-client/http-client.service';
import { TmdbConfigProvider } from '../providers/tmdb-config-provider';

@Injectable()
export class TmdbHttpRepository {
  constructor(
    private readonly httpClientService: HttpClientService,
    private readonly tmdbProvider: TmdbConfigProvider,
  ) {}

  async getMostPopularMoviesBr(): Promise<any> {
    const config = await this.tmdbProvider.getConfig();
    const url = `/movie/popular?language=pt-BR?region=BR`;

    const response = await this.httpClientService.get(url, config);

    return response;
  }
}
