import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Venda } from "./venda";
import { Item } from "./item";

@Entity('tb_itens_vendas')
export class ItemVenda {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Venda, (v) => v.itens, {onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    @JoinColumn({
        name: 'venda_id',
    })
    venda: Venda;

    @ManyToOne(() => Item, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({
        name: 'item_id'
    })
    item: Item;

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
