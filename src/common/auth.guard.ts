import { Request, Response, NextFunction } from "express";
import { IMiddleware } from "./middleware.interface";

export class AuthGuard implements IMiddleware {
    execute(req: Request, res: Response, next: NextFunction)  {
        if(req.user) {
            return next();
        }
        
        res.status(401).send({ error: 'Вы не авторизованы' });
    };
} 