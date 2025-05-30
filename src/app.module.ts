import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    UserModule,
    ProjectModule,
    TicketModule,
    SeederModule,
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '141203',
      database: 'app_database',
      entities: [User, Ticket, Project],
      synchronize: false,
      migrations: [__dirname + '/common/migration/*{.ts,.js}'],
      migrationsRun: false,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
