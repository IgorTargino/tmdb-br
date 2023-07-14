import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('MM API')
    .setDescription('My Movies API')
    .setVersion('1.0')
    .addTag('nestjs')
    .addServer('http://localhost:3000', 'Local server')
    .addServer(
      'https://filmes-famosos-br-api-heroku.herokuapp.com',
      'Heroku server',
    )
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
