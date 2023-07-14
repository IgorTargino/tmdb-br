import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConstantKeys } from 'src/infra/secrets/enums/constant-keys.enum';

@Injectable()
export class AuthService {
  constructor(
    @Inject(ConstantKeys.client_id) private readonly client_id: string,
    @Inject(ConstantKeys.client_secret) private readonly client_secret: string,
    private readonly jwtService: JwtService,
    private readonly logger: Logger,
  ) {
    this.logger = new Logger(AuthService.name);
  }

  async generateToken(payload): Promise<{ access_token: string }> {
    try {
      const { client_secret, client_id } = payload;

      if (client_secret !== this.client_secret || client_id !== this.client_id)
        throw new Error('Invalid credentials');

      const access_token = await this.jwtService.signAsync({
        client_secret,
        client_id,
      });

      return { access_token: access_token };
    } catch (error) {
      this.logger.error(error);
      throw new UnauthorizedException(error.message);
    }
  }

  async validateToken(payload) {
    try {
      const secret = payload.secret_key;
      return await this.jwtService.verifyAsync(secret);
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException('Invalid token');
    }
  }
}
