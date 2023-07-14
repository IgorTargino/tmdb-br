import { Logger, Module, forwardRef } from '@nestjs/common';
import { GetMostPopularMoviesBrService } from './movies/get-most-popular-movies-br.service';
import { GetMostLikedMoviesBrService } from './movies/get-most-liked-movies-br.service';
import { LikeMovieService } from './movies/like-movie.service';
import { DeslikeMovieService } from './movies/deslike-movie.service';
import { DatabaseModule } from 'src/infra/database/database.module';
import { HttpModule } from 'src/infra/http/http.module';

const MovieServicers = [
  GetMostPopularMoviesBrService,
  GetMostLikedMoviesBrService,
  LikeMovieService,
  DeslikeMovieService,
];

@Module({
  imports: [forwardRef(() => DatabaseModule), forwardRef(() => HttpModule)],
  controllers: [],
  providers: [Logger, ...MovieServicers],
  exports: [...MovieServicers],
})
export class UseCasesModule {}
