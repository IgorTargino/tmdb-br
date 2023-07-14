import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { GetMostPopularMoviesBrService } from '../get-most-popular-movies-br.service';
import { TmdbHttpRepository } from 'src/domain/repositories/tmdb-http.repository';
import { MovieDTO } from 'src/infra/http/tmdb/dto/get-most-popular-movies.dto';

const loggerMock = {
  error: jest.fn(),
};

const movieMock = {
  title: 'any_title',
  overview: 'any_overview',
  poster_path: 'any_poster_path',
} as MovieDTO;

const tmdbHttpRepositoryMock: TmdbHttpRepository = {
  getMostPopularMovies: jest.fn().mockResolvedValue({
    results: [movieMock],
  }),
};

describe('GetMostPopularMoviesService', () => {
  let sut: GetMostPopularMoviesBrService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        {
          provide: getModelToken('Movie'),
          useValue: movieMock,
        },
        {
          provide: 'TmdbHttpRepository',
          useValue: tmdbHttpRepositoryMock,
        },
        {
          provide: Logger,
          useValue: loggerMock,
        },
        GetMostPopularMoviesBrService,
      ],
    }).compile();

    sut = module.get<GetMostPopularMoviesBrService>(
      GetMostPopularMoviesBrService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should return a list of movies', async () => {
    jest
      .spyOn(tmdbHttpRepositoryMock, 'getMostPopularMovies')
      .mockResolvedValueOnce({
        page: 1,
        results: [movieMock],
        total_pages: 1,
        total_results: 1,
      });

    const result = await sut.execute();

    expect(tmdbHttpRepositoryMock.getMostPopularMovies).toHaveBeenCalledTimes(
      1,
    );
    expect(result).toEqual([movieMock]);
    expect(loggerMock.error).not.toHaveBeenCalled();
  });

  it('should return a list of movies with a limit', async () => {
    jest
      .spyOn(tmdbHttpRepositoryMock, 'getMostPopularMovies')
      .mockResolvedValueOnce({
        page: 1,
        results: [movieMock, movieMock],
        total_pages: 1,
        total_results: 1,
      });

    const result = await sut.execute(1);

    expect(tmdbHttpRepositoryMock.getMostPopularMovies).toHaveBeenCalledTimes(
      1,
    );
    expect(result).toEqual([movieMock]);
    expect(loggerMock.error).not.toHaveBeenCalled();
  });

  it('should throw if TmdbHttpRepository throws', async () => {
    jest
      .spyOn(tmdbHttpRepositoryMock, 'getMostPopularMovies')
      .mockRejectedValueOnce(new Error('any_error'));

    await expect(sut.execute()).rejects.toThrow(new Error('any_error'));

    expect(loggerMock.error).toHaveBeenCalledTimes(1);
  });
});
