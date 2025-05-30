import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsString({ message: 'Tên phải là một chuỗi' })
    name?: string;

    @IsOptional()
    @IsString({ message: 'Tên người dùng phải là một chuỗi' })
    @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
    username?: string;

    @IsOptional()
    @IsString({ message: 'Mật khẩu phải là một chuỗi' })
    password?: string;

    @IsOptional()
    @IsString({ message: 'Ảnh đại diện phải là một chuỗi' })
    avatar?: string;
}
