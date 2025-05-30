import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from '../../common/entities/user.entities';
import { Ticket } from '../../common/entities/ticket.entities';
import { CreateUserDto } from '../../common/dto/create-user.dto';
import * as crypto from "crypto";
import { UpdateUserDto } from "../../common/dto/update-user.dto";
import { In } from 'typeorm';

@Injectable()
export class UserService {

    @InjectRepository(User)
    private readonly userRepository: Repository<User>;

    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>;

    private hashPassword(password: string): string {
        return crypto.createHash("md5").update(password).digest("hex");
    }

    private validatePassword(password: string): boolean {
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return strongPasswordRegex.test(password);
    }

    async getUserById(id: number): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }

    async findUser(username: string): Promise<User | null> {
        return await this.userRepository.findOne({ where: { username } });
    }      

    async getUsers(
        limit: number,
        page: number,
        name?: string,
        username?: string
      ): Promise<User[]> {
        const skip = limit * (page - 1);
        const query = this.userRepository.createQueryBuilder('users')
          .take(limit)
          .skip(skip);
      
        if (name) {
          query.andWhere('users.name LIKE :name', { name: `%${name}%` });
        }
      
        if (username) {
          query.andWhere('users.username LIKE :username', { username: `%${username}%` });
        }
      
        return query.getMany();
    }

    async getTickets(id: number) {
        const searchTicket = this.ticketRepository
        .createQueryBuilder('ticket')
        .select(['ticket.title', 'ticket.deadline']);
        searchTicket.andWhere('ticket.assignId = :id', { id });
        const tickets= await searchTicket.getMany();

        if(tickets.length==0){
            throw new NotFoundException("No tickets found for user");
        }
        return tickets
    }
      
    async createUser(createUserDto: CreateUserDto) {
        const user = this.userRepository.create(createUserDto);
        return await this.userRepository.save(user);
    }

    async updateUser(id: number, updateUserDto: UpdateUserDto) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            return null;
        } else {
            this.userRepository.merge(user, updateUserDto);
            return await this.userRepository.save(user);
        }
    }

    async updatePassword(userId: number, oldPassword: string, newPassword: string) {
        const user = await this.userRepository.findOne({ where: { id: userId } });

        if (!user) {
            throw new Error("User not found!");
        }
        const oldPasswordHash = this.hashPassword(oldPassword);
        if (user.password == oldPasswordHash) {
            return "Pass is incorrect!";
        }
        if (!this.validatePassword(newPassword)) {
            return "New password is too weak! It must have at least 8 characters, including uppercase, lowercase, number, and special character.";
        }
        const newPasswordHash = this.hashPassword(newPassword);
        if (newPasswordHash === user.password) {
            return "New password must not be the same as the old password!";
        }

        user.password = newPasswordHash;
        await this.userRepository.save(user);

        return "Password updated successfully!";
    }

    async assignTicketToUser(userId: number, ticketIds: number[]): Promise<Ticket[]> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
    
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found!`);
        }
    
        const tickets = await this.ticketRepository.findBy({ id: In(ticketIds)});
    
        if (tickets.length === 0) {
            throw new NotFoundException(`No valid tickets found with given IDs`);
        }
    
        for (const ticket of tickets) {
            ticket.assign = user;
        }
    
        await this.ticketRepository.save(tickets);
    
        return tickets;
    }
    
}

