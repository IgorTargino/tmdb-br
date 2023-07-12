import { Injectable, Logger } from '@nestjs/common';
import { ConstantKeys } from './enums/constant-keys.enum';

@Injectable()
export class SecretService {
  constructor(private readonly logger: Logger) {
    this.logger = new Logger(SecretService.name);
  }

  async get(key: ConstantKeys) {
    if (!process.env[key]) {
      this.logger.error(`Missing environment variable: ${key}`);
    }

    this.logger.verbose(`Getting environment variable: ${key}`);

    return process.env[key];
  }
}
