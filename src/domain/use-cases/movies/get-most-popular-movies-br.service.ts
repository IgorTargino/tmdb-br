import { Inject, Injectable } from '@nestjs/common';
import { ItmdbHttpRepository } from 'src/domain/interfaces/itmdb-http-repository';

@Injectable()
export class GetMostPopularMoviesBrService {
  constructor(
    @Inject('ItmdbHttpRepository')
    private readonly tmdbHttpRepository: ItmdbHttpRepository,
  ) {}

  async execute(): Promise<any> {
    const response = await this.tmdbHttpRepository.getMostPopularMovies({
      language: 'pt-BR',
      region: 'BR',
      page: 1,
    });

    return response;
  }
}
