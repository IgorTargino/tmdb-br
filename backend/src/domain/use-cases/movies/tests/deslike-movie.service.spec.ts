import { HttpException, Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DeslikeMovieService } from '../deslike-movie.service';
import { getModelToken } from '@nestjs/mongoose';
import { movieMock } from 'src/domain/use-cases/movies/tests/__mocks__/movie.mock';
import { movieRepositoryMock } from 'src/domain/use-cases/movies/tests/__mocks__/movie-repository.mock';

const loggerMock = {
  error: jest.fn(),
};

describe('DeslikeMovieService', () => {
  let sut: DeslikeMovieService;

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
        DeslikeMovieService,
      ],
    }).compile();

    sut = module.get<DeslikeMovieService>(DeslikeMovieService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should throw if movie does not exist', async () => {
    jest
      .spyOn(movieRepositoryMock, 'findMovieById')
      .mockResolvedValueOnce(null);

    await expect(sut.execute('any_id')).rejects.toThrow(
      new HttpException('Movie not found', 400),
    );
  });

  it('should throw if movie already has 0 likes', async () => {
    jest.spyOn(movieRepositoryMock, 'findMovieById').mockResolvedValueOnce({
      ...movieMock,
      likes: 0,
    });

    await expect(sut.execute('any_id')).rejects.toThrow(
      new HttpException('Movie already has 0 likes', 400),
    );
  });

  it('should call removeLike with correct params', async () => {
    jest.spyOn(movieRepositoryMock, 'findMovieById');

    jest.spyOn(movieRepositoryMock, 'removeLike').mockResolvedValueOnce({
      ...movieMock,
      likes: 0,
    });

    const result = await sut.execute('any_id');

    expect(movieRepositoryMock.removeLike).toBeCalledWith('any_id');
    expect(result).toEqual({
      ...movieMock,
      likes: 0,
    });
  });

  it('should throw if removeLike throws', async () => {
    jest.spyOn(movieRepositoryMock, 'findMovieById');

    jest
      .spyOn(movieRepositoryMock, 'removeLike')
      .mockRejectedValueOnce(new Error('any_error'));

    await expect(sut.execute('any_id')).rejects.toThrow(new Error('any_error'));
  });
});
