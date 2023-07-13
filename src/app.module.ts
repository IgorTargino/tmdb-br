import { Global, Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from './infra/http/http.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ConstantKeys } from './infra/secrets/enums/constant-keys.enum';
import { SecretProvider } from './infra/secrets/secret-provider';
import { SecretModule } from './infra/secrets/secret.module';

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
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SecretModule,
    JwtModule.registerAsync({
      imports: [SecretModule],
      inject: [SecretProvider],
      useFactory: async (secretService: SecretProvider) => ({
        global: true,
        secret: await secretService.get(ConstantKeys.secret_key),
        signOptions: { expiresIn: '3600s' },
      }),
    }),
    HttpModule,
  ],
  controllers: [AppController],
  providers: [AppService, Logger, ...secretProvider],
  exports: [...secretProvider],
})
export class AppModule {}
