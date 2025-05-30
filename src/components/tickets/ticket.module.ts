import { Module } from "@nestjs/common";
import { TicketService } from "./ticket.service";
import { TicketController } from "./ticket.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Ticket } from "../../common/entities/ticket.entities";
import { Project } from "../../common/entities/project.entities";
import { User } from "../../common/entities/user.entities";
@Module({
    imports: [TypeOrmModule.forFeature([Ticket, Project, User])],
    controllers: [TicketController],
    providers: [TicketService],
})
export class TicketModule {}