import { Global, Logger, Module } from '@nestjs/common';
import { HttpModule as AxiosHttpModule } from '@nestjs/axios';
import { GetMostPopularMoviesBrService } from 'src/domain/use-cases/movies/get-most-popular-movies-br.service';
import { MovieController } from './controllers/movie.controller';
import { TmdbHttpClientService } from './tmbd-http-client/tmdb-http-client.service';
import { ConstantKeys } from './secrets/enums/constant-keys.enum';
import { SecretService } from './secrets/secret.service';

const secretProvider = Object.values(ConstantKeys).map((key) => ({
  provide: key,
  useFactory: async (secretService: SecretService) => {
    const secret = await secretService.get(key);
    return secret;
  },
  inject: [SecretService],
}));

@Global()
@Module({
  imports: [AxiosHttpModule],
  controllers: [MovieController],
  providers: [
    Logger,
    TmdbHttpClientService,
    GetMostPopularMoviesBrService,
    SecretService,
    ...secretProvider,
  ],
  exports: [TmdbHttpClientService, ...secretProvider],
})
export class HttpModule {}
