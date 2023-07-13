import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConstantKeys } from '../secrets/enums/constant-keys.enum';
import { SecretProvider } from '../secrets/secret.provider';
import { SecretModule } from '../secrets/secret.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [SecretModule],
      inject: [SecretProvider],
      useFactory: async (secretService: SecretProvider) => {
        const password = await secretService.get(
          ConstantKeys.mongo_db_password,
        );
        return {
          uri: `mongodb+srv://api-movies:${password}@movie-db.tlpfoqn.mongodb.net/?retryWrites=true&w=majority`,
        };
      },
    }),
  ],
  providers: [],
})
export class DatabaseModule {}
