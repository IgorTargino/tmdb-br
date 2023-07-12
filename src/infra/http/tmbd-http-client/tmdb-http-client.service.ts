import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AxiosError, AxiosHeaders } from 'axios';
import { firstValueFrom } from 'rxjs';
import { ConstantKeys } from '../secrets/enums/constant-keys.enum';

@Injectable()
export class TmdbHttpClientService {
  constructor(
    private readonly logger: Logger,
    private readonly httpService: HttpService,
    @Inject(ConstantKeys.tmdb_api_url) private readonly apiUrl: string,
    @Inject(ConstantKeys.tmdb_api_access_token)
    private readonly accessToken: string,
  ) {
    this.logger = new Logger(TmdbHttpClientService.name);
  }

  protected async getHeaders(): Promise<AxiosHeaders> {
    const headers = new AxiosHeaders();
    headers.set('Authorization', `Bearer ${this.accessToken}`);
    headers.set('Content-Type', 'application/json;charset=utf-8');
    return headers;
  }

  async get<Response>(resource: string, params?: any): Promise<Response> {
    try {
      this.logger.log(`GET ${this.apiUrl + resource}`);
      const headers = await this.getHeaders();
      const response = await firstValueFrom(
        this.httpService.get(this.apiUrl + resource, {
          headers,
          params,
        }),
      );
      return response.data.results;
    } catch (exception) {
      this.handleException(exception);
    }
  }

  async post<Request, Response>(
    resource: string,
    data: Request,
    params?: any,
  ): Promise<Response> {
    try {
      this.logger.log(`POST ${this.apiUrl + resource}`);
      const headers = await this.getHeaders();
      const response = await firstValueFrom(
        this.httpService.post(this.apiUrl + resource, data, {
          headers,
          params,
        }),
      );
      return response.data;
    } catch (exception) {
      this.handleException(exception);
    }
  }

  private handleException(exception: AxiosError) {
    if (exception.response) {
      const { data, status } = exception.response;
      this.logger.error(status, data);
      this.checkNotAuthorizedException(status, data);
      this.checkNotFoundException(status, data);
      this.checkBadRequestException(status, data);
      throw new HttpException(JSON.stringify(data), status);
    }
    throw exception;
  }

  private checkNotAuthorizedException(status: number, data: unknown) {
    if (status === HttpStatus.UNAUTHORIZED) {
      throw new HttpException(JSON.stringify(data), status);
    }
  }

  private checkNotFoundException(status: number, data: unknown) {
    if (status === HttpStatus.NOT_FOUND) {
      throw new NotFoundException(JSON.stringify(data));
    }
  }

  private checkBadRequestException(status: number, data: unknown) {
    if (status === HttpStatus.BAD_REQUEST) {
      throw new BadRequestException(JSON.stringify(data));
    }
  }
}
