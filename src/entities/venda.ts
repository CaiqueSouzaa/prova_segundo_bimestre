import { CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Cliente } from "./cliente";
import { Usuario } from "./usuario";
import { ItemVenda } from "./item-venda";

@Entity('tb_vendas')
@Index('idx_tb_vendas_data_venda', ['dataVenda'])
@Index('idx_tb_vendas_cliente_id', ['cliente'])
export class Venda {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Cliente, { nullable: true, onDelete: 'SET NULL', onUpdate: 'SET NULL' })
    @JoinColumn({
        name: 'cliente_id',
    })
    cliente: Cliente | null;

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
