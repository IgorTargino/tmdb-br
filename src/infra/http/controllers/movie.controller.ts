import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { GetMostPopularMoviesBrService } from 'src/domain/use-cases/movies/get-most-popular-movies-br.service';
import { AuthGuard } from '../auth/auth.guard';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Movie } from 'src/domain/entities/movie';
import { GetMostLikedMoviesService } from 'src/domain/use-cases/movies/get-most-liked-movies.service';

@UseGuards(AuthGuard)
@Controller('movie')
@ApiTags('movie')
export class MovieController {
  constructor(
    private readonly getMostPopularMoviesBrService: GetMostPopularMoviesBrService,
    private readonly getMostLikedMoviesBrService: GetMostLikedMoviesService,
  ) {}

  @Get('popular')
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getMostPopularMoviesBr(
    @Query('limit') limit?: number,
  ): Promise<Movie[]> {
    return await this.getMostPopularMoviesBrService.execute(limit);
  }

  @Get('most-liked')
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getMostLikedMoviesBr(@Query('limit') limit?: number): Promise<Movie[]> {
    return await this.getMostLikedMoviesBrService.execute(limit);
  }
}
