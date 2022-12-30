import { inject } from "inversify";
import { IConfigService } from "./config.service.interface";
import { config, DotenvConfigOutput } from 'dotenv';
import { ILogger } from "../logger/logger.interface";
import { TYPES } from "../types";
import { injectable } from 'inversify/lib/annotation/injectable';

@injectable()
export class ConfigService implements IConfigService {
    private config: DotenvConfigOutput;
    constructor(@inject(TYPES.ILogger) private logger: ILogger) {
        const result: DotenvConfigOutput  = config();

        if(result.error) {
            this.logger.error('[ConfigService] Не удалось прочитать файл .env или он отсутсвует')
        }  else {
            this.logger.log('[ConfigService] Конфигурация загружена');
            this.config = result.parsed as DotenvConfigOutput;
        }
    }

    get(key: string): string {
        return (this.config as any)[key];
    }
}