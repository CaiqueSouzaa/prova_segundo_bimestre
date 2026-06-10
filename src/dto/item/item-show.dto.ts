import { IsNotEmpty, IsString } from "class-validator";

export class ItemShowDTO {
    @IsString({
        message: 'O campo codigo deve ser um texto',
    })
    @IsNotEmpty({
        message: 'O campo codigo é obrigatório e não deve ser vázio'
    })
    codigo: string;
}
