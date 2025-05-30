import { IsOptional, IsString, IsNumber } from 'class-validator';
import { TicketStatus } from '../entities/ticket.entities';
export class UpdateTicketDto {
    @IsOptional()
    @IsString({ message: 'Mô tả phải là một chuỗi' })
    description?: string;

    @IsOptional()
    @IsNumber({}, { message: 'ID dự án phải là một số' })
    projectId?: number;

    @IsOptional()
    @IsNumber({}, { message: 'ID người được giao phải là một số' })
    assignId?: number;

    @IsOptional()
    @IsString({ message: 'Trạng thái phải đúng dạng enum đã quy định' })
    status?: TicketStatus;
}
