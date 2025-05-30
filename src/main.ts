import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser'; 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const cookieSecret = process.env.COOKIE_SECRET || 'default-secret-key';
  app.use(cookieParser(process.env.COOKIE_SECRET));

  app.enableCors({
    origin: 'http://localhost:8000', 
    credentials: true, 
  });

  app.use(
    session({
      secret: cookieSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60, // 1 phút
        httpOnly: true,
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
