import { Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '../auth.guard';

const jwtService = {
  verifyAsync: jest.fn(),
};

const loggerMock = {
  error: jest.fn(),
};

describe('AuthGuard', () => {
  let sut: AuthGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'JWT_SECRET',
          useValue: 'jwt_secret',
        },
        {
          provide: 'SECRET_KEY',
          useValue: 'secret_key',
        },
        {
          provide: Logger,
          useValue: loggerMock,
        },
        {
          provide: JwtService,
          useValue: jwtService,
        },
        AuthGuard,
      ],
    }).compile();

    sut = module.get<AuthGuard>(AuthGuard);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('canActivate', () => {
    it('should return true if the token is valid', async () => {
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {
              authorization: 'Bearer valid_token',
            },
          }),
        }),
      };

      const verifyAsyncMock = jest
        .spyOn(jwtService, 'verifyAsync')
        .mockResolvedValueOnce({ sub: 'user_id' });

      const result = await sut.canActivate(context as any);

      expect(verifyAsyncMock).toHaveBeenCalledWith('valid_token', {
        secret: expect.any(String),
      });
      expect(result).toBe(true);
    });

    it('should throw UnauthorizedException if the token is missing', async () => {
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {},
          }),
        }),
      };

      await expect(sut.canActivate(context as any)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if the token is invalid', async () => {
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {
              authorization: 'Bearer invalid_token',
            },
          }),
        }),
      };

      jest.spyOn(jwtService, 'verifyAsync').mockRejectedValueOnce(new Error());

      await expect(sut.canActivate(context as any)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
