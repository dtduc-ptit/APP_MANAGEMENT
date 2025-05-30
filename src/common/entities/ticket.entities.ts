import { Column, Entity, JoinTable,JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entities";
import { Project } from "./project.entities";
import { IsDate, IsNotEmpty, IsString } from "class-validator";

export enum TicketStatus {
    TODO ="TODO",
    INPROGRESS = "INPROGRESS",
    DONE = "DONE",  
}

@Entity()
export class Ticket {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    @IsNotEmpty()
    @IsString()
    ticketCode: string;

    @Column({length: 120})
    @IsNotEmpty()
    @IsString()
    title: string;

    @Column({length: 5000})
    description: string;

    @Column()
    @IsDate()
    deadline: Date;

    @ManyToOne(() => User, (user) => user.id, { onDelete: "SET NULL" , nullable: true})
    @JoinColumn({ name: "assignId" })
    assign: User;

    @ManyToOne(() => Project, (project) => project.id, { onDelete: "SET NULL", nullable: true })
    @JoinColumn({ name: "projectId" })
    project: Project;

    @Column({
        type: "enum",
        enum: TicketStatus
    })
    status: TicketStatus;
}