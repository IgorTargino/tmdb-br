import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LikeMovieDto {
  @ApiPropertyOptional()
  @IsString()
  movieId: string;

  @ApiPropertyOptional()
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsString()
  overview: string;

  @ApiPropertyOptional()
  @IsString()
  poster_path: string;
}
