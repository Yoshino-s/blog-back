import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle('Test')
    .setDescription('Description')
    .setVersion('V0.1.0')
    .addTag('test')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  await app.listen(3000);
}
bootstrap();
