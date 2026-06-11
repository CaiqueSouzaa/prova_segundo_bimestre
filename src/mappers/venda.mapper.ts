import { VendaCreateDTO } from "src/dto/venda/venda-create.dto";
import { VendaUpdateDTO } from "src/dto/venda/venda-update.dto";
import { Cliente } from "src/entities/cliente";
import { Usuario } from "src/entities/usuario";
import { Venda } from "src/entities/venda";

export class VendaMapper {
    static createToEntity(dto: VendaCreateDTO): Venda {
        const venda: Venda = new Venda();
        const usuario: Usuario = new Usuario();
        
        usuario.id = dto.usuario_id;
        venda.usuario = usuario;
        
        if (dto.cliente_id) {
            const cliente: Cliente = new Cliente();
            cliente.id = dto.cliente_id;

            venda.cliente = cliente;
        }

        return venda;
    }

    static updateToEntity(dto: VendaUpdateDTO, saved: Venda): Venda {
        const venda: Venda = new Venda();

        venda.id = saved.id;
        venda.dataVenda = saved.dataVenda;
        venda.itens = saved.itens;
        venda.usuario = saved.usuario;

        if (dto.cliente_id !== undefined) {
            // cliente_id presente no body: null = remover, número = definir
            if (dto.cliente_id === null) {
                venda.cliente = null;
            } else {
                const cliente: Cliente = new Cliente();
                cliente.id = dto.cliente_id;
                venda.cliente = cliente;
            }
        } else {
            // cliente_id ausente no body: mantém o cliente atual
            venda.cliente = saved.cliente ?? null;
        }

        return venda;
    }
}
