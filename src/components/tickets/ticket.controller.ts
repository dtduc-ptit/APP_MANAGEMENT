import { Body, Controller, Get, Param, Post, Put, Query, ParseIntPipe, ParseDatePipe,ValidationPipe, Res, Patch, UseGuards, Delete} from "@nestjs/common";
import { TicketService } from "./ticket.service";
import { CreateTicketDto } from "../../common/dto/create-ticket.dto";
import { Response } from 'express';
import { UpdateTicketDto } from "../../common/dto/update-ticket.dto";
import { JwtAuthGuard } from "../auth/auth.guard";
import { TicketStatus } from "../../common/entities/ticket.entities";

@UseGuards(JwtAuthGuard)
@Controller('api/tickets')
export class TicketController {
    constructor(private readonly ticketService: TicketService) {}

    @Get()
    async getTickets(
        @Query('limit', new ParseIntPipe({optional: true})) limit=10, 
        @Query('page', new ParseIntPipe({optional: true})) page=1 
    ) {
        return this.ticketService.getTickets(limit, page);
    }

    @Get('reports/ticket-count-by-user')
    async getTicketCountByUser(
        @Query('limit', new ParseIntPipe({optional: true})) limit = 10,
        @Query('page', new ParseIntPipe({optional: true})) page = 1,
        @Query('status') status: TicketStatus
    ) {
        return this.ticketService.getTicketCountByUser(limit, page, status);
    }

    @Get("/:id")
    async getTicketById(@Param('id', ParseIntPipe) id: number) {
        return this.ticketService.getTicketById(id);
    }

    @Get('/export')
    async exportTicketsCsv(@Res() res: Response){
        return this.ticketService.getTicketsCsv(res);
    }

    @Post()
    async createTicket(@Body(ValidationPipe) createTicketDto: CreateTicketDto) {
        return this.ticketService.createTicket(createTicketDto);
    }

    @Patch('/:id')
    async updateTicket(@Param('id', ParseIntPipe) id: number, @Body(ValidationPipe) updateTicketDto: UpdateTicketDto) {
        return this.ticketService.updateTicket(id, updateTicketDto);
    }

    @Delete('/:id')
    async deleteTicket(@Param('id', ParseIntPipe) id: number) {
        return this.ticketService.deleteTicket(id);
    }
}  