import { IsNotEmpty, IsString, IsOptional, MinLength } from "class-validator";

export class CreateUserDto {   

    @IsNotEmpty({ message: 'Tên người dùng là bắt buộc' })
    @IsString({ message: 'Tên người dùng phải là một chuỗi văn bản' })
    name: string;

    @IsNotEmpty({ message: 'Tên đăng nhập là bắt buộc' })
    @IsString({ message: 'Tên đăng nhập phải là một chuỗi văn bản' })
    username: string;

    @IsNotEmpty({ message: 'Mật khẩu là bắt buộc' })
    @IsString({ message: 'Mật khẩu phải là một chuỗi văn bản' })
    @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }) 
    password: string;

    @IsOptional()
    @IsString()
    avatar?: string;
}
