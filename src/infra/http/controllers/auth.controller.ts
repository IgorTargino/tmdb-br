import { Controller, Post, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { ApiHeaders, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Realiza o login' })
  @ApiHeaders([
    { name: 'client_id', description: 'ID do cliente', example: 'abc123' },
    {
      name: 'client_secret',
      description: 'Segredo do cliente',
      example: 'def456',
    },
  ])
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Req() request: Request) {
    const headers = request.headers;
    return this.authService.generateToken(headers);
  }
}
