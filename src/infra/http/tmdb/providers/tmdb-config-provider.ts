import { Inject, Injectable, Logger } from '@nestjs/common';
import { AxiosHeaders, AxiosRequestConfig } from 'axios';
import { ConstantKeys } from '../../secrets/enums/constant-keys.enum';

@Injectable()
export class TmdbConfigProvider {
  private config: AxiosRequestConfig;

  constructor(
    private readonly logger: Logger,
    @Inject(ConstantKeys.tmdb_api_url) private readonly apiUrl: string,
    @Inject(ConstantKeys.tmdb_api_access_token)
    private readonly accessToken: string,
  ) {
    this.logger = new Logger(TmdbConfigProvider.name);
  }

  protected async getHeaders(): Promise<AxiosHeaders> {
    const headers = new AxiosHeaders();
    headers.set('Authorization', `Bearer ${this.accessToken}`);
    headers.set('Content-Type', 'application/json;charset=utf-8');
    return headers;
  }

  async getConfig(): Promise<AxiosRequestConfig> {
    this.config = {
      baseURL: this.apiUrl,
      headers: await this.getHeaders(),
    };

    return this.config;
  }
}
