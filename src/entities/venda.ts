import { CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Cliente } from "./cliente";
import { Usuario } from "./usuario";
import { ItemVenda } from "./item-venda";

@Entity('tb_venda')
export class Venda {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Cliente, { onDelete: 'SET NULL', onUpdate: 'SET NULL' })
    @JoinColumn({
        name: 'cliente_id',
    })
    cliente: Cliente;

    @ManyToOne(() => Usuario, { onDelete: 'SET NULL', onUpdate: 'SET NULL' })
    @JoinColumn({
        name: 'usuario_id',
    })
    usuario: Usuario;

    @CreateDateColumn({
        name: 'data_venda',
        nullable: false,
    })
    dataVenda: Date;

    @OneToMany(() => ItemVenda, (iv) => iv.venda)
    itens: ItemVenda[];
}
