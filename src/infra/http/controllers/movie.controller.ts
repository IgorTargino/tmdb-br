import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetMostPopularMoviesBrService } from 'src/domain/use-cases/movies/get-most-popular-movies-br.service';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';

@UseGuards(AuthGuard)
@Controller('movie')
@ApiTags('movie')
export class MovieController {
  constructor(
    private readonly getMostPopularMoviesBrService: GetMostPopularMoviesBrService,
  ) {}

  @Get('popular')
  async getMostPopularMoviesBr(): Promise<any> {
    return await this.getMostPopularMoviesBrService.execute();
  }
}
