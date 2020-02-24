import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
/*
import fastifyCookie from 'fastify-cookie';
import fastifySession from 'fastify-session';
import redis from 'redis';
import { RedisConfig } from './config';
*/

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter({}));
  
  /*const client = redis.createClient(RedisConfig.port, RedisConfig.host, {
    password: RedisConfig.password
  });

  app.register(fastifyCookie);
  app.register(fastifySession, {
    secret: ['111', '222'],
    store: client
  });*/

  const options = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000, '0.0.0.0');
}

bootstrap();
