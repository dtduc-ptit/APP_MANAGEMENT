import { IsArray, IsNotEmpty, IsNumber, ArrayNotEmpty } from "class-validator";
import { Type } from "class-transformer";

export class AssignTicketDto {
    @IsArray({ message: 'Danh sách ticket phải là một mảng' })
    @ArrayNotEmpty({ message: 'Danh sách ticket không được để trống' })
    @IsNumber({}, { each: true, message: 'Mỗi ticket ID phải là một số' })
    @Type(() => Number)
    ticketId: number[];
}
