import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './components/users/user.module';
import { ProjectModule } from './components/projects/project.module';
import { TicketModule } from './components/tickets/ticket.module';
import { User } from './common/entities/user.entities';
import { Ticket } from './common/entities/ticket.entities';
import { Project } from './common/entities/project.entities';
import { SeederModule } from './common/seeder/seeder.module';
import { AuthModule } from './components/auth/auth.module';
import { LoggerMiddleware } from './components/middleware/logger.middleware';

@Module({
  imports: [
    UserModule,
    ProjectModule,
    TicketModule,
    SeederModule,
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '141203',
      database: process.env.DB_DATABASE || 'app_database',
      entities: [User, Ticket, Project],
      synchronize: false,
      migrations: [__dirname + '/common/migration/*{.ts,.js}'],
      migrationsRun: false,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}
