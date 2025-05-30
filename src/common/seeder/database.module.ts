import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entities';
import { Project } from '../entities/project.entities';
import { Ticket } from '../entities/ticket.entities';
import { SeederService } from './seeder.service';
import { SeederController } from './seeder.controller';


@Module({
    imports: [
        TypeOrmModule.forFeature([User, Project, Ticket]), 
    ],
    providers: [SeederService],
    controllers: [SeederController],
})
export class DatabaseModule {}
