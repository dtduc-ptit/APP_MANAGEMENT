import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entities/user.entities";
import { Repository } from "typeorm";
import { Project } from "../entities/project.entities";
import { Ticket } from "../entities/ticket.entities";
import { faker } from '@faker-js/faker';
import { ProjectType } from "../entities/project.entities";
import { TicketStatus } from "../entities/ticket.entities";
import { console } from "inspector";

@Injectable()
export class SeederService {
  private users: User[] = [];
  private projects: Project[] = []

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Project) private projectRepository: Repository<Project>,
    @InjectRepository(Ticket) private ticketRepository: Repository<Ticket>,
  ) {}

  async createUsers(count: number): Promise<User[]> {

    const users: User[] = [];
    for (let i = 0; i < count; i++) {
        const user = this.userRepository.create({
            name: faker.person.firstName(),
            username: faker.internet.username() + i,
            password: faker.internet.password(),
        });
        users.push(user);

        if (users.length === 100) {
            try {
                await this.userRepository.save(users);
                console.log('Saved 100 users to database');
                users.length = 0;
            } catch (error) {
                console.error('Error saving users:', error);
            }
        }
    }
    if (users.length) {
        try {
            await this.userRepository.save(users);
            console.log('Saved remaining users to database:', users.length);
        } catch (error) {
            console.error('Error saving remaining users:', error);
        }
    }
    this.users = users;
    return users;
  }

  async seedProjectsOnly(count: number): Promise<Project[]> {

    if (!this.users.length) {
      this.users = await this.userRepository.createQueryBuilder('user')
        .select(['user.id', 'user.name'])
        .getMany();
    }

    const projects: Project[] = [];
    const types = [ProjectType.LABOUR, ProjectType.FIX_PRICE, ProjectType.MAINTENANCE];

    for (let i = 0; i < count; i++) {
      const project = this.projectRepository.create({
        name: faker.company.name()+i,
        startDate: faker.date.past(),
        endDate: faker.date.future(),
        projectType: faker.helpers.arrayElement(types),
        members: faker.helpers.arrayElements(this.users, { min: 2, max: 10 }),
        profit: faker.number.int({ min: 100, max: 100000 }),
      });
      projects.push(project);
      if (projects.length === 100) {
        await this.projectRepository.save(projects);
        projects.length = 0;
      }
    }
    if (projects.length) {
      await this.projectRepository.save(projects);
    }
    this.projects = projects;
    return projects;
  }

  async seedTicketsOnly(count: number) {
    const tickets: Ticket[] = [];

    if (!this.users.length) {
      this.users = await this.userRepository.createQueryBuilder('user')
        .select(['user.id', 'user.name'])
        .getMany();
    }

    if (!this.projects.length) {
      this.projects = await this.projectRepository.createQueryBuilder('project')
        .select(['project.id', 'project.name'])
        .getMany();
    }
    const statuses = [TicketStatus.TODO, TicketStatus.INPROGRESS, TicketStatus.DONE];

    for (let i = 0; i < count; i++) {
      const ticket = this.ticketRepository.create({
        ticketCode: `TKCode${i + 1}_v1`,
        title: faker.lorem.words(3),
        description: faker.lorem.sentences(1),
        deadline: faker.date.future(),
        assign: faker.helpers.arrayElement(this.users),
        project: faker.helpers.arrayElement(this.projects),
        status: faker.helpers.arrayElement(statuses),
      });
      tickets.push(ticket);

      if (tickets.length === 500) {
        await this.ticketRepository.save(tickets);
        tickets.length = 0;
      }
    }
    if (tickets.length) {
      await this.ticketRepository.save(tickets);
    }
  }

}
