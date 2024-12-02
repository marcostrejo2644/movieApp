import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    const port = process.env.PORT || 3000;
    app.setGlobalPrefix('api');

    app.get(Reflector);

    const config = new DocumentBuilder()
      .setTitle('Movie App')
      .setDescription('Movies app')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, {});

    await app.listen(port);

    const appUrl = await app.getUrl();
    const swaggerUrl = `${appUrl}/docs`;
    console.log(`App running on ${appUrl}`);
    console.log(`Swagger documentation available at ${swaggerUrl}`);
  } catch (err) {
    console.log(err);
  }
}
bootstrap();
