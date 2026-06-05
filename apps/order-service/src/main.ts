/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import {
  OUTLET_SERVICE,
  PAYMENT_SERVICE,
  PRODUCT_SERVICE,
  ResponseInterceptor,
  RmqService,
  TypeOrmExceptionFilter,
} from '@jum-caffe/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: true,
  });
  const config = app.get(ConfigService);

  const globalPrefix = 'api/orders';
  app.setGlobalPrefix(globalPrefix);

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new TypeOrmExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Order Service')
    .setDescription('Service for manage order')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, documentFactory);

  const port = config.get('PORT') || 3001;
  await app.listen(port);

  // RabbitMQ
  const rmqService = app.get<RmqService>(RmqService);

  // Connect microservices
  app.connectMicroservice(rmqService.getOptions(PRODUCT_SERVICE));
  app.connectMicroservice(rmqService.getOptions(PAYMENT_SERVICE));
  await app.startAllMicroservices();

  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();
