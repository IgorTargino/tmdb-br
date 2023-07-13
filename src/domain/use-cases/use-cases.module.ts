import { Logger, Module } from '@nestjs/common';
import { DatabaseModule } from 'src/infra/database/database.module';
import { GetMostPopularMoviesBrService } from './movies/get-most-popular-movies-br.service';
import { GetMostLikedMoviesService } from './movies/get-most-liked-movies.service';
import { TmdbHttpService } from 'src/infra/http/tmdb/tmdb-http.service';
import { TmdbConfigProvider } from 'src/infra/http/tmdb/providers/tmdb-config.provider';
import { HttpClientService } from 'src/infra/http/http-client/http-client.service';
import { HttpModule } from '@nestjs/axios';

const TmdbRepository = {
  provide: 'TmdbHttpRepository',
  useClass: TmdbHttpService,
};

@Module({
  imports: [DatabaseModule, HttpModule],
  controllers: [],
  providers: [
    Logger,
    TmdbConfigProvider,
    HttpClientService,
    TmdbRepository,
    GetMostPopularMoviesBrService,
    GetMostLikedMoviesService,
  ],
  exports: [GetMostPopularMoviesBrService, GetMostLikedMoviesService],
})
export class UseCasesModule {}
