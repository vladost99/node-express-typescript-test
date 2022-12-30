import express, { Express } from 'express';
import { Server } from 'http';
import { UserController } from './users/users.controller';
import { ExceptionFilter } from './errors/exception.filter';
import { ILogger } from './logger/logger.interface';
import { injectable } from 'inversify/lib/annotation/injectable';
import { inject } from 'inversify/lib/annotation/inject';
import { TYPES } from './types';
import 'reflect-metadata';
import { IConfigService } from './config/config.service.interface';
import { PrismaService } from './database/prisma.service';
import { AuthMiddleware } from './common/auth.middleware';

@injectable()
export class App {
    app: Express;
    port: number;
    server: Server;

    constructor(
        @inject(TYPES.ILogger)  private logger: ILogger,
        @inject(TYPES.UserController) private userController: UserController,
        @inject(TYPES.ExceptionFilter) private exceptionFilter:  ExceptionFilter,
        @inject(TYPES.ConfigService) private config: IConfigService,
        @inject(TYPES.PrismaService) private PrismaService: PrismaService
        ) {
        this.app = express();
        this.port = 8000;
    }

    useRoutes(): void {
        this.app.use('/users', this.userController.router);
    }

    useExeptionFilters(): void {
        this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter))
    }

    useMiddleware(): void {
        this.app.use(express.json());
        const authMiddleware = new AuthMiddleware(this.config.get('SECRET'));
        this.app.use(authMiddleware.execute.bind(authMiddleware));
    }

    public async init(): Promise<void> {
        this.useMiddleware();
        this.useRoutes();
        this.useExeptionFilters();
        await this.PrismaService.connect();
        this.server = this.app.listen(this.port);
        this.logger.log(`Server is running on ${this.port}`);
    }
}