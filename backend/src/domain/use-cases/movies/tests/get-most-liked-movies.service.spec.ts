import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { movieMock } from 'src/domain/use-cases/movies/tests/__mocks__/movie.mock';
import { movieRepositoryMock } from 'src/domain/use-cases/movies/tests/__mocks__/movie-repository.mock';
import { GetMostLikedMoviesBrService } from '../get-most-liked-movies-br.service';
import { Movie } from 'src/domain/entities/movie';

const loggerMock = {
  error: jest.fn(),
};

describe('GetMostLikedMoviesBrService', () => {
  let sut: GetMostLikedMoviesBrService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        {
          provide: getModelToken('Movie'),
          useValue: movieMock,
        },
        {
          provide: 'MovieRepository',
          useValue: movieRepositoryMock,
        },
        {
          provide: Logger,
          useValue: loggerMock,
        },
        GetMostLikedMoviesBrService,
      ],
    }).compile();

    sut = module.get<GetMostLikedMoviesBrService>(GetMostLikedMoviesBrService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should return the most liked movies', async () => {
    jest
      .spyOn(movieRepositoryMock, 'findAllMovies')
      .mockResolvedValueOnce([movieMock]);

    const response = await sut.execute();

    expect(movieRepositoryMock.findAllMovies).toHaveBeenCalledTimes(1);
    expect(response).toEqual([movieMock]);
    expect(loggerMock.error).not.toHaveBeenCalled();
  });

  it('should return the most liked movies with a limit', async () => {
    const limit = 1;
    const movies = [
      { title: 'Movie 1', likes: 10 },
      { title: 'Movie 2', likes: 8 },
    ] as Movie[];

    jest
      .spyOn(movieRepositoryMock, 'findAllMovies')
      .mockResolvedValueOnce(movies);

    const response = await sut.execute(limit);

    expect(movieRepositoryMock.findAllMovies).toHaveBeenCalledTimes(1);
    expect(response).toEqual([movies[0]]);
    expect(loggerMock.error).not.toHaveBeenCalled();
  });

  it('should return order most liked array', async () => {
    const movies = [
      { title: 'Movie 1', likes: 2 },
      { title: 'Movie 2', likes: 8 },
    ] as Movie[];

    jest
      .spyOn(movieRepositoryMock, 'findAllMovies')
      .mockResolvedValueOnce(movies);

    const response = await sut.execute();

    expect(movieRepositoryMock.findAllMovies).toHaveBeenCalledTimes(1);
    expect(response).toEqual([movies[1], movies[0]]);
    expect(loggerMock.error).not.toHaveBeenCalled();
  });

  it('should throw if movieRepository throws', async () => {
    const error = new Error('MovieRepository Error');
    jest
      .spyOn(movieRepositoryMock, 'findAllMovies')
      .mockRejectedValueOnce(error);

    await expect(sut.execute()).rejects.toThrow(error);
    expect(movieRepositoryMock.findAllMovies).toHaveBeenCalledTimes;
  });
});
