import { Injectable, NotFoundException, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Project } from '../../common/entities/project.entities';
import { CreateProjectDto } from "../../common/dto/create-project.dto";
import { Ticket, TicketStatus } from "../../common/entities/ticket.entities";
import { UpdateProjectDto } from "../../common/dto/update-project.dto";

@Injectable()
export class ProjectService {
    @InjectRepository(Project)
    private projectRepository: Repository<Project>;

    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>;

    async getProjectById(id: number){
        return await this.projectRepository.findOne({where:{id}})
    }

    async createProject(createProjectDto: CreateProjectDto) {
        const project = this.projectRepository.create(createProjectDto);
        return await this.projectRepository.save(project);
    }

    async getProjects(
        limit: number,
        page: number,
        projectName?: string,
        projectType?: string
    ): Promise<Project[]> {
        const skip = limit * (page - 1);
    
        const query = this.projectRepository.createQueryBuilder('projects')
            .take(limit)
            .skip(skip);
    
        if (projectName) {
            query.where('projects.name LIKE :name', { name: `%${projectName}%` });
        }
    
        if (projectType) {
            if (projectName) {
                query.andWhere('projects.projectType = :projectType', { projectType });
            } else {
                query.where('projects.projectType = :projectType', { projectType });
            }
        }
    
        try {
            const projects = await query.getMany();
    
            if (!projects.length) {
                throw new NotFoundException('Không tìm thấy dự án nào phù hợp với điều kiện.');
            }
    
            return projects;
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException('Lỗi truy vấn');
        }
    }

    async getTickets(query: {id: number, ticketDeadline?: Date,start?: string, end?: string }) {
        const searchTicket = this.ticketRepository
            .createQueryBuilder('ticket')
            .leftJoinAndSelect('ticket.assign', 'assign') 
            .select([
                'ticket.id',
                'ticket.title',
                'assign.id', 
                'ticket.deadline',
                'ticket.status'
            ])
            .where('ticket.projectId = :projectId', { projectId: query.id });

        if (query.ticketDeadline) {
            searchTicket.andWhere('ticket.deadline = :ticketDeadline', { ticketDeadline: query.ticketDeadline });
        }
        if(query.start && query.end){
            searchTicket.andWhere('ticket.deadline BETWEEN :from AND :to', {from: query.start, to: query.end })
        }
        return await searchTicket.getMany();
    }

    async updateProject(id: number, updateProjectDto: UpdateProjectDto) {
        const project = await this.projectRepository.findOne({where: {id}});
        if (!project) {
            return null;
        }else {
            this.projectRepository.merge(project, updateProjectDto);
            return await this.projectRepository.save(project);
        }
    }

    async deleteProject(id: number){
        await this.projectRepository.delete(id);
        return {message: 'Xóa project thành công!'}
    }

    async filterProjects(limit: number, page: number, startDate?: Date, profit?: number) {
        console.time('filterProjects');
        const skip = limit * (page - 1);
        try {
            const query = this.projectRepository
                .createQueryBuilder('project')
                .take(limit)
                .skip(skip);

            if (startDate) {
                query.andWhere('project.startDate >= :startDate', { startDate });
            }

            if (profit !== undefined) {
                query.andWhere('project.profit >= :profit', { profit });
            }

            query.orderBy('project.profit', 'DESC');

            const projects = await query.getMany();

            console.timeEnd('filterProjects');

            if (!projects.length) {
                throw new NotFoundException('Không tìm thấy dự án nào phù hợp với điều kiện.');
            }

            return projects;
        } catch (error) {
            console.timeEnd('filterProjects');
            console.error(error);
            throw new InternalServerErrorException('Lỗi truy vấn');
        }
    }

    async getTicketCountByProject(limit: number, page: number) {
        const safeLimit = Math.min(Number(limit) || 10, 100);
        const safePage = Math.max(Number(page) || 1, 1);
        const skip = safeLimit * (safePage - 1);

        const rawQuery = this.projectRepository
            .createQueryBuilder('project')
            .leftJoin('project.ticket', 'ticket')
            .select('project.id', 'projectId')
            .addSelect('project.name', 'projectName')
            .addSelect('COUNT(ticket.id)', 'ticketCount')
            .groupBy('project.id')
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