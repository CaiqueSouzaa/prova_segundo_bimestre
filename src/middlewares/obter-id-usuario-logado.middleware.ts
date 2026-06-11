import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { NextFunction, Response } from "express";
import { IdRequest } from "src/interfaces/id-request";

@Injectable()
export class ObterIdUsuarioLogadoMiddleware implements NestMiddleware {
    constructor(
        private readonly jwtService: JwtService,
    ) { }

    async use(req: IdRequest, res: Response, next: NextFunction) {
        const authorization = req.headers.authorization!;

        if (!authorization) {
            throw new UnauthorizedException();
        }

        const token = authorization.split(' ')[1];

        
        try {
            await this.jwtService.verifyAsync(token);
        } catch {
            throw new UnauthorizedException();
        }

        const decoded: {
            id: number,
            nome: string,
            sobrenome: string,
        } = this.jwtService.decode(token);

        console.log(decoded);

        req.userId = decoded.id;

        next();
    }
}
