import { Module } from '@nestjs/common';
import { SecretProvider } from './secret-provider';

@Module({
  providers: [SecretProvider],
  exports: [SecretProvider],
})
export class SecretModule {}
