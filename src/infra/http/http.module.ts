import { Global, Logger, Module } from '@nestjs/common';
import { HttpModule as AxiosHttpModule } from '@nestjs/axios';
import { GetMostPopularMoviesBrService } from 'src/domain/use-cases/movies/get-most-popular-movies-br.service';
import { MovieController } from './controllers/movie.controller';
import { ConstantKeys } from '../secrets/enums/constant-keys.enum';
import { SecretProvider } from '../secrets/secret-provider';
import { HttpClientService } from './http-client/http-client.service';
import { TmdbHttpRepository } from './tmdb/repositories/tmdb-http-repository';
import { TmdbConfigProvider } from './tmdb/providers/tmdb-config-provider';

const secretProvider = Object.values(ConstantKeys).map((key) => ({
  provide: key,
  useFactory: async (secretService: SecretProvider) => {
    const secret = await secretService.get(key);
    return secret;
  },
  inject: [SecretProvider],
}));

const TmdbRepository = {
  provide: 'ItmdbHttpRepository',
  useClass: TmdbHttpRepository,
};

@Global()
@Module({
  imports: [AxiosHttpModule],
  controllers: [MovieController],
  providers: [
    Logger,
    TmdbConfigProvider,
    HttpClientService,
    TmdbRepository,
    GetMostPopularMoviesBrService,
    SecretProvider,
  ],
  exports: [HttpClientService],
})
export class HttpModule {}
