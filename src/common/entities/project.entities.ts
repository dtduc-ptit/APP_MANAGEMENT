import { Column, Entity, Index, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entities";
import { Ticket } from "./ticket.entities";
import { IsDate, IsString } from "class-validator";

export enum ProjectType {
    LABOUR ="LABOUR",
    FIX_PRICE = "FIX_PRICE",
    MAINTENANCE = "MAINTENANCE",  
}

@Entity()
export class Project {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    @IsString()
    name: string;

    @Index()
    @Column({ nullable: true })
    @IsDate()
    startDate: Date;

    @Column({ nullable: true })
    @IsDate()
    endDate: Date;

    @Column({
        type: "enum",
        enum: ProjectType
    })
    projectType: ProjectType;
    
    @Index()
    @Column({ nullable: true })
    profit: number;

    @ManyToMany(() => User, (user) => user.id, { onDelete: "SET NULL" , nullable: true})
    @JoinTable({ name: "project_members" })
    members: User[];

    @OneToMany(() => Ticket, (ticket) => ticket.project, { onDelete: "SET NULL" , nullable: true})
    ticket: Ticket[];
}