import { Global, Logger, Module } from '@nestjs/common';
import { HttpModule as AxiosHttpModule } from '@nestjs/axios';
import { GetMostPopularMoviesBrService } from 'src/domain/use-cases/movies/get-most-popular-movies-br.service';
import { MovieController } from './controllers/movie.controller';
import { TmdbHttpClientService } from './tmbd-http-client/tmdb-http-client.service';
import { ConstantKeys } from './secrets/enums/constant-keys.enum';
import { SecretProvider } from './secrets/secret-provider';

const secretProvider = Object.values(ConstantKeys).map((key) => ({
  provide: key,
  useFactory: async (secretService: SecretProvider) => {
    const secret = await secretService.get(key);
    return secret;
  },
  inject: [SecretProvider],
}));

@Global()
@Module({
  imports: [AxiosHttpModule],
  controllers: [MovieController],
  providers: [
    Logger,
    TmdbHttpClientService,
    GetMostPopularMoviesBrService,
    SecretProvider,
    ...secretProvider,
  ],
  exports: [TmdbHttpClientService, ...secretProvider],
})
export class HttpModule {}
