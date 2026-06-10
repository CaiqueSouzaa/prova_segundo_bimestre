import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('tb_clientes')
export class Cliente {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'cpf',
        nullable: false,
        unique: true,
    })
    cpf: string;

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
