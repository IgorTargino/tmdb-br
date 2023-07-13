import { Injectable, Logger } from '@nestjs/common';
import { ConstantKeys } from './enums/constant-keys.enum';

@Injectable()
export class SecretProvider {
  constructor(private readonly logger: Logger) {
    this.logger = new Logger(SecretProvider.name);
  }

  async get(key: ConstantKeys) {
    if (!process.env[key]) {
      this.logger.error(`Missing environment variable: ${key}`);
    }

    this.logger.log(`Getting environment variable: ${key}`);

    return process.env[key];
  }
}
