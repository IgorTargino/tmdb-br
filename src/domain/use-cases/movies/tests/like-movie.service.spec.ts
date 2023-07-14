import { HttpException, Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { LikeMovieService } from '../like-movie.service';
import { LikeMovieDto } from 'src/infra/http/controllers/dto/like-movie.dto';
import { movieMock } from './__mocks__/movie.mock';
import { movieRepositoryMock } from './__mocks__/movie-repository.mock';

const loggerMock = {
  error: jest.fn(),
};

describe('LikeMovieService', () => {
  let sut: LikeMovieService;

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
        LikeMovieService,
      ],
    }).compile();

    sut = module.get<LikeMovieService>(LikeMovieService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should add like to movie if movieId is provided', async () => {
    jest.spyOn(movieRepositoryMock, 'findMovieById');

    const result = await sut.execute({ movieId: 'any_id' } as LikeMovieDto);

    expect(movieRepositoryMock.findMovieById).toBeCalledWith('any_id');
    expect(result).toEqual({ ...movieMock, likes: 1 });
    expect(loggerMock.error).not.toBeCalled();
  });

  it('should create movie if movieId is not provided', async () => {
    jest.spyOn(movieRepositoryMock, 'createMovie');

    const result = await sut.execute({
      title: 'any_title',
      overview: 'any_overview',
      poster_path: 'any_poster_path',
    } as LikeMovieDto);

    expect(movieRepositoryMock.createMovie).toBeCalledWith({
      title: 'any_title',
      overview: 'any_overview',
      poster_path: 'any_poster_path',
      likes: 1,
    });
    expect(result).toEqual({ ...movieMock, likes: 1 });
    expect(loggerMock.error).not.toBeCalled();
  });

  it('should throw if movie title does not exist', async () => {
    await expect(
      sut.execute({
        overview: 'any_overview',
        poster_path: 'any_poster_path',
      } as LikeMovieDto),
    ).rejects.toThrow(new HttpException('Movie data is invalid', 400));
  });
});
