import { Injectable } from '@nestjs/common';
import { TmdbHttpClientService } from 'src/infra/http/tmbd-http-client/tmdb-http-client.service';

@Injectable()
export class GetMostPopularMoviesBrService {
  constructor(private readonly TmdbHttpClient: TmdbHttpClientService) {}

  async execute(): Promise<any> {
    const response = await this.TmdbHttpClient.get(
      '/movie/popular?language=pt-BR?region=BR?limit=10',
    );

    return response;
  }
}
