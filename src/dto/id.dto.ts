import { IsNumberString } from "class-validator";

export class IdDTO {
    @IsNumberString({}, {
        message: 'O campo ID é obrigatório'
    })
    id: number;
}
