import { IsNotEmpty, IsString, IsDate, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { ProjectType } from '../entities/project.entities';
import { Type } from 'class-transformer';

export class CreateProjectDto {
    @IsNotEmpty({ message: 'Tên dự án là bắt buộc' })
    @IsString({ message: 'Tên dự án phải là một chuỗi' })
    name: string;

    @IsOptional()
    @Type(() => Date)
    @IsDate({ message: 'Ngày bắt đầu phải là một ngày hợp lệ' })
    startDate?: Date;

    @IsOptional()
    @Type(() => Date)
    @IsDate({ message: 'Ngày kết thúc phải là một ngày hợp lệ' })
    endDate?: Date;

    @IsNotEmpty({ message: 'Loại dự án là bắt buộc' })
    @IsEnum(ProjectType, { message: 'Loại dự án không hợp lệ' })
    projectType: ProjectType;

    @IsOptional()
    @IsNumber({}, { message: 'Doanh thu phải là một số' })
    profit?: number;
}
