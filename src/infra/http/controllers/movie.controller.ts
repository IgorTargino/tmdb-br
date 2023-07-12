import { Controller, Get } from '@nestjs/common';
import { GetMostPopularMoviesBrService } from 'src/domain/use-cases/movies/get-most-popular-movies-br.service';

@Controller('movie')
export class MovieController {
  constructor(
    private readonly getMostPopularMoviesBrService: GetMostPopularMoviesBrService,
  ) {}

  @Get('popular')
  async getMostPopularMoviesBr(): Promise<any> {
    return await this.getMostPopularMoviesBrService.execute();
  }
}
