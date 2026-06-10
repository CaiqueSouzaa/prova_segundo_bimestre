import { Injectable, NestMiddleware } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { NextFunction, Response } from "express";
import { IdRequest } from "src/interfaces/id-request";

@Injectable()
export class ObterIdUsuarioLogadoMiddleware implements NestMiddleware {
    constructor(
        private readonly jwtService: JwtService,
    ) { }

    use(req: IdRequest, res: Response, next: NextFunction) {
        const authorization = req.headers.authorization!;

        const token = authorization.split(' ')[1];

        const decoded: {
            id: number,
            nome: string,
            sobrenome: string,
        } = this.jwtService.decode(token);

        req.userId = decoded.id;

        next();
    }
}
