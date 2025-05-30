import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SeederService } from "./seeder.service";
import { SeederController } from "./seeder.controller";
import { User } from "../entities/user.entities";
import { Project } from "../entities/project.entities";
import { Ticket } from "../entities/ticket.entities";

@Module({
  imports: [TypeOrmModule.forFeature([User, Project, Ticket])],
  controllers: [SeederController],
  providers: [SeederService],
})
export class SeederModule {}
