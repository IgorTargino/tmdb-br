import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConstantKeys } from '../secrets/enums/constant-keys.enum';
import { SecretProvider } from '../secrets/secret.provider';
import { SecretModule } from '../secrets/secret.module';
import { MongoMovieService } from './mongo/mongo-movie.service';
import { MovieSchema } from './mongo/mongo-movie.schema';

const MovieProvider = {
  provide: 'MovieRepository',
  useClass: MongoMovieService,
};

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
    MongooseModule.forFeature([{ name: 'Movie', schema: MovieSchema }]),
  ],
  providers: [MovieProvider],
  exports: [MovieProvider],
})
export class DatabaseModule {}
