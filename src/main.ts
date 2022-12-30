import { Container } from "inversify";
import { App } from "./app";
import { ExceptionFilter } from "./errors/exception.filter";
import { LoggerService } from "./logger/logger.service";
import { UserController } from "./users/users.controller";
import { ILogger } from "./logger/logger.interface";
import { TYPES } from "./types";
import { ContainerModule } from "inversify/lib/container/container_module";
import { interfaces } from "inversify/lib/interfaces/interfaces";
import { IUserController } from "./users/users.controller.interface";
import { IUserService } from "./users/user.service.interface";
import { UserService } from "./users/users.service";
import { IConfigService } from './config/config.service.interface';
import { ConfigService } from "./config/config.service";
import { PrismaService } from './database/prisma.service';
import { IUserRepository } from './users/users.repository.interface';
import { UsersRepository } from "./users/users.repository";

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
    bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
    bind<ExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter);
    bind<IUserController>(TYPES.UserController).to(UserController);
    bind<IUserService>(TYPES.UserService).to(UserService);
    bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
    bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
    bind<IUserRepository>(TYPES.UserRepository).to(UsersRepository);
    bind<App>(TYPES.Application).to(App);
});

function bootstrap() {
    const appContainer = new Container();
    appContainer.load(appBindings);
    const app = appContainer.get<App>(TYPES.Application);
    app.init();

    return { appContainer, app };
}


export const { app, appContainer } = bootstrap();
