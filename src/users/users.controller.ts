import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../common/base.controller';
import { HttpError } from '../errors/http-error.class';
import { injectable } from 'inversify/lib/annotation/injectable';
import { TYPES } from '../types';
import { ILogger } from './../logger/logger.interface';
import { inject } from 'inversify/lib/annotation/inject';
import { IUserController } from './users.controller.interface';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserService } from './users.service';
import { ValidateMiddleware } from './../common/validate.middleware';
import { sign } from 'jsonwebtoken';
import { ConfigService } from '../config/config.service';
import { AuthGuard } from '../common/auth.guard';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILogger) loggerService: ILogger,
		@inject(TYPES.UserService) private UserService: UserService,
		@inject(TYPES.ConfigService) private config: ConfigService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				func: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
			{
				path: '/login',
				method: 'post',
				func: this.login,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},
            {
				path: '/info',
				method: 'get',
				func: this.info,
                middlewares: [new AuthGuard()]
			},
		]);
	}

	async login(
		{ body }: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.UserService.validateUser(body);

		if (!result) {
			return next(new HttpError(401, 'ошибка авторизации'));
		}

		const jwt = await this.signJWT(body.email, this.config.get('SECRET'));
		this.ok(res, { ...body, jwt });
	}
	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.UserService.createdUser(body);

		if (!result) {
			return next(new HttpError(403, 'Такой пользователь уже существует'));
		}

		this.ok(res, { id: result.id, email: result.name });
	}
	private signJWT(email: string, secret: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			sign(
				{
					email,
					iat: Math.floor(Date.now() / 1000),
				},
				secret,
				{
					algorithm: 'HS256',
				},
				(err: any, token: any) => {
					if (err) reject(err);

					resolve(token);
				},
			);
		});
	}
    async info({ user }: Request,res: Response,next: NextFunction) {
        const userInfo = await this.UserService.getUserInfo(user);
        this.ok(res, userInfo);
    }
}
