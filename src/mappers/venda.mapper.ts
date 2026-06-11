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
        const cliente: Cliente = new Cliente();
        
        if (dto.cliente_id) {
            cliente.id = dto.cliente_id;
        } else if (saved.cliente) {
            cliente.id = saved.cliente.id;
        }

        venda.id = saved.id;
        venda.dataVenda = saved.dataVenda;
        venda.itens = saved.itens;
        venda.usuario = saved.usuario;

        venda.cliente = cliente;

        return venda;
    }
}
