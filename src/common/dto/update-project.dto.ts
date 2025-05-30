import { IsString, IsDate, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { ProjectType } from '../entities/project.entities';

export class UpdateProjectDto {
    @IsOptional()
    @IsString({ message: 'Tên dự án phải là một chuỗi' })
    name?: string;

    @IsOptional()
    @IsDate({ message: 'Ngày bắt đầu phải là một ngày hợp lệ' })
    startDate?: Date;

    @IsOptional()
    @IsDate({ message: 'Ngày kết thúc phải là một ngày hợp lệ' })
    endDate?: Date;

    @IsOptional()
    @IsEnum(ProjectType, { message: 'Loại dự án không hợp lệ' })
    projectType?: ProjectType;

    @IsOptional()
    @IsNumber({}, { message: 'Lợi nhuận phải là một số' })
    profit?: number;
}
