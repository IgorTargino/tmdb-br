import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { GetMostPopularMoviesBrService } from 'src/domain/use-cases/movies/get-most-popular-movies-br.service';
import { AuthGuard } from '../auth/auth.guard';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Movie } from 'src/domain/entities/movie';
import { GetMostLikedMoviesBrService } from 'src/domain/use-cases/movies/get-most-liked-movies-br.service';
import { LikeMovieDto } from './dto/like-movie.dto';
import { LikeMovieService } from 'src/domain/use-cases/movies/like-movie.service';
import { DeslikeMovieService } from 'src/domain/use-cases/movies/deslike-movie.service';
import { DeslikeMovieDto } from './dto/deslike-movie.dt';

@UseGuards(AuthGuard)
@Controller('movie')
@ApiTags('movie')
export class MovieController {
  constructor(
    private readonly getMostPopularMoviesBrService: GetMostPopularMoviesBrService,
    private readonly getMostLikedMoviesBrService: GetMostLikedMoviesBrService,
    private readonly likeMovieService: LikeMovieService,
    private readonly deslikeMovieService: DeslikeMovieService,
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

  @Post('like')
  async likeMovie(@Body('') body: LikeMovieDto): Promise<Movie> {
    return await this.likeMovieService.execute(body);
  }

  @Post('deslike')
  async deslikeMovie(@Body('') body: DeslikeMovieDto): Promise<Movie> {
    return await this.deslikeMovieService.execute(body.movieId);
  }
}
