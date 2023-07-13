import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { GetMostPopularMoviesBrService } from 'src/domain/use-cases/movies/get-most-popular-movies-br.service';
import { AuthGuard } from '../auth/auth.guard';
import { ApiProperty, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Movie } from 'src/domain/entities/movie';
import { GetMostLikedMoviesService } from 'src/domain/use-cases/movies/get-most-liked-movies.service';
import { LikeMovieDto } from './dto/like-movie.dto';
import { LikeMovieService } from 'src/domain/use-cases/movies/like-movie.service';
import { DeslikeMovieService } from 'src/domain/use-cases/movies/deslike-movie.service';

@UseGuards(AuthGuard)
@Controller('movie')
@ApiTags('movie')
export class MovieController {
  constructor(
    private readonly getMostPopularMoviesBrService: GetMostPopularMoviesBrService,
    private readonly getMostLikedMoviesBrService: GetMostLikedMoviesService,
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
  async likeMovie(@Body('') likeMovieDto: LikeMovieDto): Promise<Movie> {
    return await this.likeMovieService.execute(likeMovieDto);
  }

  @Post('deslike')
  @ApiProperty({ name: 'movieId', required: true })
  async deslikeMovie(@Body('') body): Promise<Movie> {
    return await this.deslikeMovieService.execute(body.movieId);
  }
}
