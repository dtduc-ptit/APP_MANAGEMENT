import { IsDate, IsNotEmpty, IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';
import { TicketStatus } from '../entities/ticket.entities';
import { Type } from 'class-transformer';

export class CreateTicketDto {
    @IsNotEmpty({ message: 'Mã ticket là bắt buộc' })
    @IsString({ message: 'Mã ticket phải là một chuỗi văn bản' })
    ticketCode: string;

    @IsNotEmpty({ message: 'Tiêu đề là bắt buộc' })
    @IsString({ message: 'Tiêu đề phải là một chuỗi văn bản' })
    title: string;

    @IsNotEmpty({ message: 'Mô tả là bắt buộc' })
    @IsString({ message: 'Mô tả phải là một chuỗi văn bản' })
    description: string;

    @IsNotEmpty({ message: 'Ngày hết hạn là bắt buộc' })
    @Type(() => Date)
    @IsDate({ message: 'Ngày hết hạn phải là một kiểu ngày hợp lệ' })
    deadline: Date;

    @IsOptional()
    @IsNumber({}, { message: 'ID người giao phải là một số' })
    assignId?: number;

    @IsOptional()
    @IsNumber({}, { message: 'ID dự án phải là một số' })
    projectId: number;

    @IsOptional()
    @IsEnum(TicketStatus, { message: 'Trạng thái không hợp lệ' })
    status?: TicketStatus;
}
