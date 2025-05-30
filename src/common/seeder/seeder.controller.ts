import { Controller, Post } from "@nestjs/common";
import { SeederService } from "./seeder.service";
import { Get, Query } from "@nestjs/common/decorators";

@Controller('api/seeder')
export class SeederController {
    constructor(private readonly seederService: SeederService) {}
  @Post('users')
  async seedUsers() {
    const users = await this.seederService.createUsers(10);
    return { message: 'Users seeded', count: users.length };
  }

  @Post('projects')
  async seedProjects() {
    const projects = await this.seederService.seedProjectsOnly(50);
    return { message: 'Projects seeded', count: projects.length };
  }

  @Post('tickets')
  async seedTickets() {
    await this.seederService.seedTicketsOnly(100);
    return { message: 'Tickets seeded'};
  }

}
