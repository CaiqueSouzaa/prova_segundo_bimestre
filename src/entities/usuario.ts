import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('tb_usuarios')
export class Usuario {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'email',
        nullable: false,
        unique: true,
    })
    email: string;

    @Column({
        name: 'senha',
        nullable: false,
    })
    senha: string;

    @Column({
        name: 'nome',
        nullable: false,
    })
    nome: string;

    @Column({
        name: 'sobrenome',
        nullable: false,
    })
    sobrenome: string
}
