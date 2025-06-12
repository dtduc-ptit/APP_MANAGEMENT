import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    Patch,
    Query,
    ValidationPipe,
    ParseIntPipe,
    UseGuards,
    Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from '../../common/dto/create-user.dto';
import { UpdateUserDto } from '../../common/dto/update-user.dto';
import { AssignTicketDto } from "../../common/dto/assign-ticket.dto";
import { JwtAuthGuard } from '../auth/auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/users')  
    export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get(':id') 
    getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUserById(id);
    }

    @Get('user')
    findUser(@Param('username') username: string){
        return this.userService.findUser(username)
    }

    @Get()
    async getUsers(
        @Query('limit', new ParseIntPipe({optional: true})) limit = 20,
        @Query('page', new ParseIntPipe({optional: true})) page = 1,
        @Query('name') name?: string,
        @Query('username') username?: string
    ) {
        return this.userService.getUsers(limit, page, name, username);
    }

    @Get('/:id/tickets')
    async getTickets(@Param('id', ParseIntPipe) id: number) {
        return this.userService.getTickets(id);
    }

    @Post()
    async createUser(@Body(ValidationPipe) createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto);
    }

    @Patch(':id')
    async updateUser(
        @Param('id', ParseIntPipe) id: number,
        @Body(ValidationPipe) updateUserDto: UpdateUserDto
    ) {
        return this.userService.updateUser(id, updateUserDto);
    }

    @Patch(':id/password')
    async updatePassword(
        @Param('id', ParseIntPipe) userId: number,
        @Body() body: { oldPassword: string; newPassword: string }
    ) {
        return this.userService.updatePassword(
        userId,
        body.oldPassword,
        body.newPassword
        );
    }
    @Put('/:id/tickets')
    async assignTicketToUser(@Param('id', ParseIntPipe) id : number,@Body() assignTicketDto: AssignTicketDto){
        return this.userService.assignTicketToUser(id, assignTicketDto.ticketId)
    }

    @Delete(':id')
    async deleteUser(@Param('id', ParseIntPipe) id: number) {
        return this.userService.deleteUser(id);
    }
}
