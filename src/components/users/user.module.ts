import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../../common/entities/user.entities";
import { UserService } from './user.service';
import { Ticket } from "../../common/entities/ticket.entities";

@Module({
    imports: [TypeOrmModule.forFeature([User, Ticket])],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService], 
})
export class UserModule {}