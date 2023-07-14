import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LikeMovieDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  overview: string;

  @ApiProperty()
  @IsString()
  poster_path: string;
}
