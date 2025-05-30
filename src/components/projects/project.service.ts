import { Injectable, NotFoundException, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Project } from '../../common/entities/project.entities';
import { CreateProjectDto } from "../../common/dto/create-project.dto";
import { Ticket, TicketStatus } from "../../common/entities/ticket.entities";
import { UpdateProjectDto } from "src/common/dto/update-project.dto";

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

}