import { UserLoginDto } from "./dto/user-login.dto";
import { UserRegisterDto } from "./dto/user-register.dto";
import { User } from "./user.entity";
import { IUserService } from "./user.service.interface";
import { injectable } from 'inversify/lib/annotation/injectable';
import { inject } from "inversify/lib/annotation/inject";
import { TYPES } from "../types";
import { IConfigService } from "../config/config.service.interface";
import 'reflect-metadata';
import { IUserRepository } from './users.repository.interface';
import { UserModel } from '@prisma/client';

@injectable()
export class UserService implements IUserService {
    constructor(
        @inject(TYPES.ConfigService) private config: IConfigService,
        @inject(TYPES.UserRepository) private UserRepository: IUserRepository
    ) {}

    async createdUser({ email, name, password }: UserRegisterDto): Promise<UserModel | null>  {
        const newUser = new User(email, name);
        await newUser.setPassword(password, Number(this.config.get('SALT')));
        const existedUser = await this.UserRepository.find(newUser.email);

        if(existedUser) return null;

        return this.UserRepository.create(newUser);
    }

    async getUserInfo(email: string): Promise<UserModel | null> {
        return this.UserRepository.find(email);
    }

    async validateUser({ email, password }: UserLoginDto): Promise<boolean>  {
        const existedUser = await this.UserRepository.find(email);

        if(!existedUser) {
            return false;
        }

        const newUser = new User(existedUser.email, existedUser.name, existedUser.password);
        
        return  newUser.comparePassword(password);
    }
}