import {
  BadRequestException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';

const jwtService = {
  signAsync: jest.fn(),
  verifyAsync: jest.fn(),
};

const loggerMock = {
  error: jest.fn(),
};

describe('AuthService', () => {
  let sut: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'CLIENT_ID',
          useValue: 'valid_id',
        },
        {
          provide: 'CLIENT_SECRET',
          useValue: 'valid_secret',
        },
        {
          provide: JwtService,
          useValue: jwtService,
        },
        {
          provide: Logger,
          useValue: loggerMock,
        },
        AuthService,
      ],
    }).compile();

    sut = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateToken', () => {
    it('should generate and return an access token if credentials are valid', async () => {
      const payload = {
        client_secret: 'valid_secret',
        client_id: 'valid_id',
      };
      const access_token = 'generated_token';

      jest.spyOn(jwtService, 'signAsync').mockResolvedValueOnce(access_token);

      const result = await sut.generateToken(payload);

      expect(jwtService.signAsync).toHaveBeenCalledWith({
        client_secret: payload.client_secret,
        client_id: payload.client_id,
      });
      expect(result).toEqual({ access_token });
    });

    it('should throw an UnauthorizedException if credentials are invalid', async () => {
      const payload = {
        client_secret: 'invalid_secret',
        client_id: 'invalid_id',
      };

      await expect(sut.generateToken(payload)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('validateToken', () => {
    it('should validate and return the payload if the token is valid', async () => {
      const payload = {
        secret_key: 'valid_token',
      };
      const decodedPayload = { sub: 'user_id' };

      jest
        .spyOn(jwtService, 'verifyAsync')
        .mockResolvedValueOnce(decodedPayload);

      const result = await sut.validateToken(payload);

      expect(jwtService.verifyAsync).toHaveBeenCalledWith(payload.secret_key);
      expect(result).toEqual(decodedPayload);
    });

    it('should throw a BadRequestException if the token is invalid', async () => {
      const payload = {
        secret_key: 'invalid_token',
      };

      jest.spyOn(jwtService, 'verifyAsync').mockRejectedValueOnce(new Error());

      await expect(sut.validateToken(payload)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
