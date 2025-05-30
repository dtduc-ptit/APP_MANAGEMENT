import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignInUserDto {
    @IsString({ message: 'Tên đăng nhập phải là một chuỗi' })
    @IsNotEmpty({ message: 'Tên đăng nhập không được để trống' })
    username: string;

    @IsNotEmpty({ message: 'Mật khẩu là bắt buộc' })
    @IsString({ message: 'Mật khẩu phải là một chuỗi văn bản' })
    @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }) 
    password: string;
}