import { Logger } from '@nestjs/common';
import { ConstantKeys } from './enums/constant-keys.enum';

export class SecretProvider {
  constructor(private readonly logger: Logger) {
    this.logger = new Logger(SecretProvider.name);
  }

  async get(key: ConstantKeys) {
    const secret = process.env[key];
    if (!secret) {
      this.logger.error(`Missing environment variable: ${key}`);
    }

    this.logger.log(`Getting environment variable: ${key}`);

    return secret;
  }
}
