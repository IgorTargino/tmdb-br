import { Global, Logger, Module } from '@nestjs/common';
import { HttpModule } from './infra/http/http.module';
import { ConfigModule } from '@nestjs/config';
import { ConstantKeys } from './infra/secrets/enums/constant-keys.enum';
import { SecretProvider } from './infra/secrets/secret.provider';
import { SecretModule } from './infra/secrets/secret.module';
import { DatabaseModule } from './infra/database/database.module';

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
    HttpModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [Logger, ...secretProvider],
  exports: [...secretProvider],
})
export class AppModule {}
