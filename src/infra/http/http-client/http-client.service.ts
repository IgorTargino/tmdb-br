import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  LoggerService,
  NotFoundException,
} from '@nestjs/common';
import { AxiosRequestConfig, AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class HttpClientService {
  protected defaultConfig: Partial<AxiosRequestConfig> = {};
  constructor(
    private readonly logger: LoggerService,
    private readonly httpService: HttpService,
  ) {
    this.logger = new Logger(HttpClientService.name);
  }

  async get<Response>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<Response> {
    try {
      const response = await firstValueFrom(this.httpService.get(url, config));
      return response.data;
    } catch (exception) {
      this.handleException(exception);
    }
  }

  async post<Request, Response>(
    url: string,
    data: Request,
    config?: AxiosRequestConfig,
  ): Promise<Response> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(url, data, config),
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
