
import { PrismaClient } from '@prisma/client';
import { injectable } from 'inversify/lib/annotation/injectable';
import { inject } from 'inversify/lib/annotation/inject';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';

@injectable()
export class PrismaService {
    client: PrismaClient;

    constructor(@inject(TYPES.ILogger) private logger: ILogger) {
        this.client = new PrismaClient();
    }

    async connect(): Promise<void> {
        try {
            await this.client.$connect();
            this.logger.log('[PrismaService] Успшно подключились к базе данных');
        } catch(e) {
            if(e instanceof Error) {
                this.logger.error('[PrismaService] Ошибка подключения к базе данных' + ' ' + e.message);
            }
        }
    }

    async disconnect(): Promise<void> {
        await this.client.$disconnect();
    }
}