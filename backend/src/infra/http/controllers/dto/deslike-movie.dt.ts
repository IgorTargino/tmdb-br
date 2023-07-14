import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DeslikeMovieDto {
  @ApiProperty()
  @IsString()
  movieId: string;
}
