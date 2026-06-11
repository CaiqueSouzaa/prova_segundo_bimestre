export class CupomFiscal {
    id: number;
    itens: {
        produto: string;
        quantia: number;
        valor_unitario: number;
        subtotal: number;
    }[];
    total: number;
    vendedor: {
        nome: string;
        sobrenome: string;
    };
    cliente?: {
        nome: string;
        sobrenome: string;
    }
}
