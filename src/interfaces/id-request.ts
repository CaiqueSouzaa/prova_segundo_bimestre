import { Request } from "express";

export interface IdRequest extends Request {
    userId: number;
}
