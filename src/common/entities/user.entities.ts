import {Column, Entity, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
import { Ticket } from './ticket.entities';
import { IsString, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

@Entity()

export class User{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsNotEmpty()
    @IsString()
    name: string;
  
    @Column({ unique: true })
    @IsNotEmpty()
    @IsString()
    username: string;

    @Column()
    @IsNotEmpty()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;

    @Column({nullable: true})
    @IsOptional()
    avatar: string;

    @OneToMany(() => Ticket , (ticket) => ticket.assign, { onDelete: "SET NULL" , nullable: true})
    ticket: Ticket[];
}
