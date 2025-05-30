import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProjectService } from "./project.service";
import { ProjectController } from "./project.controller";
import { Project } from "../../common/entities/project.entities";
import { Ticket } from "src/common/entities/ticket.entities";

@Module({
    imports: [TypeOrmModule.forFeature([Project, Ticket])],
    controllers: [ProjectController],
    providers: [ProjectService],
})
export class ProjectModule {}