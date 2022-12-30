import { IsEmail, IsString } from "class-validator";

export class UserRegisterDto {
    @IsEmail({}, { message: 'Неверно указан емаил'})
    email: string;
    
    @IsString({ message: 'Неверно указан пароль' })
    password: string;

    @IsString({ message: 'Неверно указан неймл' })
    name: string;
}