import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AxiosRequestConfig, AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class HttpClientService {
  private readonly logger = new Logger();
  protected defaultConfig: Partial<AxiosRequestConfig> = {};

  constructor(private readonly httpService: HttpService) {
    this.defaultConfig.timeout = 15000;
  }

  async get<Response>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<Response> {
    try {
      this.logger.log(`GET ${url}`);
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
      this.logger.log(`POST ${url}`);
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
