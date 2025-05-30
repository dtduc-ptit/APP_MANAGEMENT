import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entities/user.entities";
import { Repository } from "typeorm";
import { Project } from "../entities/project.entities";
import { Ticket } from "../entities/ticket.entities";
import { faker } from '@faker-js/faker';
import { ProjectType } from "../entities/project.entities";
import { TicketStatus } from "../entities/ticket.entities";

//npx ts-node src/common/seeder/database.seeder.ts

@Injectable()
export class DatabaseSeeder{
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Project) private projectRepository: Repository<Project>,
        @InjectRepository(Ticket) private ticketRepository: Repository<Ticket>
    ){}
    async run(){
        await this.userRepository.delete({});
        await this.projectRepository.delete({});
        await this.ticketRepository.delete({});

        console.log("testcase2")
        const users= await this.createUsers(1000);

        const projects= await this.createProjects(5000, users);

        await this.createTickets(1000000, users, projects);
    }

    private async createUsers(count: number): Promise<User[]>{
        const users: User[] = [];
        for (let i=0;i<count; i++){
            const user = this.userRepository.create({
                name: faker.person.firstName(),
                username: faker.internet.username()+i,
                password: faker.internet.password()
            });
            users.push(await this.userRepository.save(user));
        }
        return users;
    }

    private async createProjects(count: number, users: User[]): Promise<Project[]> {
        const projects: Project[] = [];
        const projectTypes = [ProjectType.LABOUR, ProjectType.FIX_PRICE, ProjectType.MAINTENANCE];
        for (let i = 0; i < count; i++) {
            const project = this.projectRepository.create({
                name: faker.person.fullName(),
                startDate: faker.date.past(),
                endDate: faker.date.future(),
                projectType: faker.helpers.arrayElement(projectTypes),
                members: faker.helpers.arrayElements(users),
                profit: faker.number.int({ min: 100, max: 100000 }),
            });
            projects.push(await this.projectRepository.save(project));
        }
        return projects;
    }

    private async createTickets(count: number, users: User[], projects: Project[]){
        const statuses =[TicketStatus.DONE, TicketStatus.INPROGRESS, TicketStatus.TODO];
        for (let i=0;i<count; i++){
            const ticket = this.ticketRepository.create({
                ticketCode: `TKCode${i + 1}`,
                title: faker.lorem.words(3),
                description: faker.lorem.sentence(),
                deadline: faker.date.future(),
                assign: faker.helpers.arrayElement(users),
                project: faker.helpers.arrayElement(projects),
                status: faker.helpers.arrayElement(statuses),
            })
            await this.ticketRepository.save(ticket);
        }
    }
}