import { IsNotEmpty, IsString } from "class-validator";

export class UsuarioCreateDTO {
    @IsString({
        message: 'O campo nome deve ser um texto',
    })
    @IsNotEmpty({
        message: 'O campo nome é obrigatório e não deve ser vázio'
    })
    nome: string;

    @IsString({
        message: 'O campo sobrenome deve ser um texto',
    })
    @IsNotEmpty({
        message: 'O campo sobrenome é obrigatório e não deve ser vázio'
    })
    sobrenome: string;

    @IsString({
        message: 'O campo email deve ser um texto',
    })
    @IsNotEmpty({
        message: 'O campo email é obrigatório e não deve ser vázio'
    })
    email: string;

    @IsString({
        message: 'O campo password deve ser um texto',
    })
    @IsNotEmpty({
        message: 'O campo password é obrigatório e não deve ser vázio'
    })
    senha: string;
}