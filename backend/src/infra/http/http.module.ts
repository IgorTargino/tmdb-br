import { Global, Logger, Module } from '@nestjs/common';
import { HttpModule as AxiosHttpModule } from '@nestjs/axios';
import { MovieController } from './controllers/movie.controller';
import { SecretProvider } from '../secrets/secret.provider';
import { HttpClientService } from './http-client/http-client.service';
import { TmdbConfigProvider } from './tmdb/providers/tmdb-config.provider';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { SecretModule } from '../secrets/secret.module';
import { ConstantKeys } from '../secrets/enums/constant-keys.enum';
import { UseCasesModule } from 'src/domain/use-cases/use-cases.module';
import { TmdbHttpService } from './tmdb/tmdb-http.service';

const TmdbRepository = {
  provide: 'TmdbHttpRepository',
  useClass: TmdbHttpService,
};

@Global()
@Module({
  imports: [
    AxiosHttpModule,
    UseCasesModule,
    JwtModule.registerAsync({
      imports: [SecretModule],
      inject: [SecretProvider],
      useFactory: async (secretService: SecretProvider) => {
        return {
          global: true,
          secret: await secretService.get(ConstantKeys.secret_key),
          signOptions: { expiresIn: '3600s' },
        };
      },
    }),
  ],
  controllers: [MovieController, AuthController],
  providers: [
    Logger,
    SecretProvider,
    AuthService,
    TmdbConfigProvider,
    HttpClientService,
    TmdbRepository,
  ],
  exports: [TmdbRepository],
})
export class HttpModule {}
