import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UsuarioUpdateDTO {
    id: number;

    @IsString({
        message: 'O campo nome deve ser um texto',
    })
    @IsNotEmpty({
        message: 'O campo nome é obrigatório e não deve ser vázio'
    })
    @IsOptional()
    nome: string;

    @IsString({
        message: 'O campo sobrenome deve ser um texto',
    })
    @IsNotEmpty({
        message: 'O campo sobrenome é obrigatório e não deve ser vázio'
    })
    @IsOptional()
    sobrenome: string;

    @IsString({
        message: 'O campo email deve ser um texto',
    })
    @IsNotEmpty({
        message: 'O campo email é obrigatório e não deve ser vázio'
    })
    @IsOptional()
    email: string;
}
