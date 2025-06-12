import { Body, Controller, Get, Param, Post, Patch, Query, Delete, ParseIntPipe, ParseDatePipe,ValidationPipe, UseGuards, Optional} from "@nestjs/common";
import { ProjectService } from "./project.service";
import { CreateProjectDto } from "../../common/dto/create-project.dto";
import { UpdateProjectDto } from "../../common/dto/update-project.dto";
import { JwtAuthGuard } from "../auth/auth.guard";

@UseGuards(JwtAuthGuard)
@Controller('api/projects')
export class ProjectController {
    constructor(private readonly projectService: ProjectService) {}

    @Get('filter')
    async filterProjects(
        @Query('limit', new ParseIntPipe({optional: true})) limit = 10, 
        @Query('page', new ParseIntPipe({optional: true})) page = 1, 
        @Query('startDate', new ParseDatePipe({optional: true})) startDate?: Date,
        @Query('profit', ParseIntPipe) profit?: number,
    ) {
        return this.projectService.filterProjects(limit, page, startDate, profit);
    }

    @Get(':id')
    getProjectById(@Param('id', ParseIntPipe) id: number){
        return this.projectService.getProjectById(id);
    }

    @Get()
    getProjects(
        @Query('limit', new ParseIntPipe({optional: true})) limit = 10, 
        @Query('page', new ParseIntPipe({optional: true})) page = 1, 
        @Query('name') projectName? : string, 
        @Query('projectType') projectType? : string
    ) {
        return this.projectService.getProjects(limit, page, projectName,projectType);
    }

    @Get(':id/tickets')
    async getTickets(
        @Param('id', ParseIntPipe) id: number,
        @Query('deadline', new ParseDatePipe({optional: true})) ticketDeadline?: Date,
        @Query('from',new ParseDatePipe({optional: true})) start?: string,
        @Query('to',new ParseDatePipe({optional: true})) end?: string,
    ) {
        return this.projectService.getTickets({id,ticketDeadline, start, end});
    }

    @Post()
    createProject(@Body(ValidationPipe) createProjectDto: CreateProjectDto) {
        return this.projectService.createProject(createProjectDto);
    }
    
    @Patch(':id')
    updateProject(@Param('id', ParseIntPipe) id: number, @Body() updateProjectDto: UpdateProjectDto) {
        return this.projectService.updateProject(id, updateProjectDto);
    }

    @Delete(':id')
    deleteProject(@Param('id', ParseIntPipe) id: number){
        return this.projectService.deleteProject(id);
    }

    @Get('reports/ticket-count')
    async getTicketCountByProject(
        @Query('limit', new ParseIntPipe({optional: true})) limit = 10,
        @Query('page', new ParseIntPipe({optional: true})) page = 1,
    ) {
        return this.projectService.getTicketCountByProject(limit, page);
    }

} 