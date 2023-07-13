import { Inject, Injectable } from '@nestjs/common';
import { TmdbHttpRepository } from 'src/domain/repositories/tmdb-http-repository';

@Injectable()
export class GetMostPopularMoviesBrService {
  constructor(
    @Inject('TmdbHttpRepository')
    private readonly tmdbHttpRepository: TmdbHttpRepository,
  ) {}

  async execute(): Promise<any> {
    const response = await this.tmdbHttpRepository.getMostPopularMovies({
      language: 'pt-BR',
      region: 'BR',
    });

    return response;
  }
}
