import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('tb_itens')
export class Item {
    @PrimaryColumn()
    codigo: string;

    @Column({
        name: 'nome',
        nullable: false,
    })
    nome: string;

    @Column({
        name: 'quantia',
        nullable: false,
        default: '0.00',
        type: 'decimal',
        precision: 10,
        scale: 2,
        transformer: {
            to: (value: number) => value,
            from: (value: string) => parseFloat(value),
        }
    })
    quantia: number;

    @Column({
        name: 'valor',
        nullable: false,
        default: '0.00',
        type: 'decimal',
        precision: 10,
        scale: 2,
        transformer: {
            to: (value: number) => value,
            from: (value: string) => parseFloat(value),
        }
    })
    valor: number;
}
