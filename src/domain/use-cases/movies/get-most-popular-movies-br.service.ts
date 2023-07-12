import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GetMostPopularMoviesBrService {
  constructor(
    @Inject('ItmdbHttpRepository') private readonly tmdbHttpRepository,
  ) {}

  async execute(): Promise<any> {
    const response = await this.tmdbHttpRepository.getMostPopularMoviesBr();

    return response;
  }
}
