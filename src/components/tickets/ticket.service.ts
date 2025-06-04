import { Global, Injectable, NotFoundException , StreamableFile} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { Ticket, TicketStatus } from "../../common/entities/ticket.entities";
import { CreateTicketDto } from "../../common/dto/create-ticket.dto";
import { Project } from "../../common/entities/project.entities";
import { User } from "../../common/entities/user.entities"; 
import { UpdateTicketDto } from "../../common/dto/update-ticket.dto";
import { Parser } from 'json2csv';
import { Response } from 'express';
@Global()
@Injectable()
export class TicketService {
    // dependency injection
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>;

    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>;

    @InjectRepository(User)
    private readonly userRepository: Repository<User>;

    async getTickets(limit: number, page: number): Promise<Ticket[]> {
        const skip = limit * (page - 1);
        const tickets= this.ticketRepository.createQueryBuilder('tickets')
            .take(limit)
            .skip(skip)
            .getMany()
        return tickets;
    }

    async getTicketById(id: number): Promise<Ticket> {
        const ticket = await this.ticketRepository.findOne({ where: { id }});
        if (!ticket) {
            throw new NotFoundException(`Ticket with id ${id} not found`);
        }
        return ticket;
    }

    async createTicket(createTicketDto: CreateTicketDto) {
        const ticket = this.ticketRepository.create(createTicketDto);
        if (createTicketDto.projectId) {
            const project = await this.projectRepository.findOne({ where: { id: createTicketDto.projectId } });
            if (project) {
                ticket.project = project;
            }
        }
        if (createTicketDto.assignId) {
            const assign = await this.userRepository.findOne({ where: { id: createTicketDto.assignId } });
            if (assign) {
                ticket.assign = assign;
            }
        }
        return await this.ticketRepository.save(ticket);
    }

    async updateTicket(id: number, updateTicketDto: UpdateTicketDto): Promise<Ticket> {
        const ticket = await this.ticketRepository.findOne({where: {id}});
        if (!ticket) {
            throw new NotFoundException(`Ticket with id ${id} not found`);
        }
        this.ticketRepository.merge(ticket, updateTicketDto);

        const project = await this.projectRepository.findOne({ where: { id: updateTicketDto.projectId } });
        if (project) {
            ticket.project = project; 
        }
        const assign = await this.userRepository.findOne({ where: { id: updateTicketDto.assignId } });  
        if (assign) {
            ticket.assign = assign;
        }
        return await this.ticketRepository.save(ticket);
    }

    async getTicketsCsv(res: Response){
        console.time('CSV generation time');

        // const tickets = await this.ticketRepository.createQueryBuilder('tickets')
        //     .leftJoinAndSelect('tickets.assign', 'assign')
        //     .leftJoinAndSelect('tickets.project', 'project')
        //     .select([
        //         'tickets.id',
        //         'tickets.title',
        //         'assign.name',
        //         'project.name',
        //         'tickets.status'
        //     ])
        //     .getMany();
        
        const tickets = await this.ticketRepository.find({
            relations: ['project', 'assign'],
        });
        const fields = [
            { label: 'Ticket ID', value: 'id' },
            { label: 'Project Name', value: 'project.name' },
            { label: 'Title', value: 'title' },
            { label: 'Assigned User', value: 'assign.name' },
            { label: 'Ticket Status', value: 'status' }
        ];
        const parser = new Parser({ fields});

        const csvData = parser.parse(tickets);

        res.header('Content-Type', 'text/csv')
        res.attachment('users.csv');
        res.send(csvData);
        console.timeEnd('CSV generation time');
    }

    async deleteTicket(id: number): Promise<void> {
        const ticket = await this.ticketRepository.findOne({ where: { id } });
        if (!ticket) {
            throw new NotFoundException(`Ticket with id ${id} not found`);
        }
        await this.ticketRepository.remove(ticket);
    }

    async getTicketCountByUser(limit = 10, page = 1, status: TicketStatus) {
        const safeLimit = Math.min(Number(limit) || 10, 100);
        const safePage = Math.max(Number(page) || 1, 1);
        const skip = safeLimit * (safePage - 1);

        const rawQuery = this.ticketRepository
            .createQueryBuilder('ticket')
            .leftJoin('ticket.assign', 'user')
            .select('user.id', 'userId')
            .addSelect('COUNT(ticket.id)', 'ticketCount')
            .where('ticket.assignId IS NOT NULL')
            .andWhere('ticket.status = :status', { status })
            .groupBy('user.id')
            .orderBy('ticketCount', 'DESC');

        const fullData = await rawQuery.getRawMany();

        const paginated = fullData.slice(skip, skip + safeLimit);

        return {
            data: paginated.map(item => ({
                ...item,
                ticketCount: Number(item.ticketCount),
            })),
            meta: {
                total: fullData.length,
                currentPage: safePage,
                limit: safeLimit,
                totalPages: Math.ceil(fullData.length / safeLimit),
            }
        };
    }

}