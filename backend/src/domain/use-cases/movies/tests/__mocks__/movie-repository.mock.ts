import { MovieRepository } from 'src/domain/repositories/movie.repository';
import { movieMock } from './movie.mock';

export const movieRepositoryMock: MovieRepository = {
  createMovie: jest.fn().mockResolvedValue(movieMock),
  findAllMovies: jest.fn().mockResolvedValue(movieMock),
  findMovieById: jest.fn().mockResolvedValue(movieMock),
  findMovieByTitle: jest.fn().mockResolvedValue(movieMock),
  addLike: jest.fn().mockResolvedValue(movieMock),
  removeLike: jest.fn().mockResolvedValue(movieMock),
};
