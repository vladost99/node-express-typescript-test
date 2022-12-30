import { User } from "./user.entity";
import { IUserRepository } from "./users.repository.interface";
import { UserModel } from '@prisma/client';
import { inject } from 'inversify/lib/annotation/inject';
import { injectable } from 'inversify/lib/annotation/injectable';
import { TYPES } from "../types";
import { PrismaService } from "../database/prisma.service";

@injectable()
export class UsersRepository implements IUserRepository {
    constructor(@inject(TYPES.PrismaService) private PrismaService: PrismaService) {}

    async create({ email, password, name }: User): Promise<UserModel>  {
        return this.PrismaService.client.userModel.create({
            data: {
                email,
                password,
                name
            }
        });
    }
   async find(email: string): Promise<UserModel | null> {
        return this.PrismaService.client.userModel.findFirst({
            where: {
                email
            }
        });
   } 
}