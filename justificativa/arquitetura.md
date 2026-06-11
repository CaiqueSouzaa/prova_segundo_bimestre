# Banco de Dados
## 1. Definição da Arquitetura
### 1.1 Escolha Tecnológica
* **Tipo de banco escolhido (SQL ou NoSQL)**: SQL
* **Provedor utilizado (PostgreSQL, MySQL, SQL Server, MongoDB, Redis, DynamoDB, etc.)**: PostgreSQL
* **Justificativa técnica da escolha**: PostgreSQL foi escolhido por ser um banco relacional robusto com total conformidade ACID, ideal para dados estruturados com relacionamentos bem definidos. Além do modelo relacional tradicional, oferece suporte nativo a JSON, o que adiciona flexibilidade sem abrir mão da consistência. É open-source, amplamente adotado em produção e conta com ecossistema maduro de ferramentas e integrações.
### 1.2 Requisitos do Sistema
Descrever:
* **Objetivo do sistema**: Facilitar o gerenciamento financeiro do comércio;
* **Principais entidades ou documentos**: Usuários, Itens e Vendas
* **Volume estimado de dados**:

Tamanho por linha

| Tabela | Colunas | Bytes/linha |
|---|---|---|
| `tb_usuarios` | integer(4) + varchar(100) + varchar(250) + varchar(50) + varchar(100) | 508 bytes |
| `tb_clientes` | integer(4) + varchar(11) + varchar(50) + varchar(100) | 169 bytes |
| `tb_itens` | varchar(25) + varchar(250) + decimal(8) + decimal(8) | 295 bytes |
| `tb_vendas` | integer(4) + integer(4) + integer(4) + timestamp(8) | 24 bytes |
| `tb_itens_vendas` | integer(4) + integer(4) + varchar(25) + decimal(8) + decimal(8) | 53 bytes |

## Volume por tabela

| Tabela | Linhas | Subtotal |
|---|---|---|
| `tb_usuarios` | 2 | ~1 KB |
| `tb_clientes` | 100 | ~16 KB |
| `tb_itens` | 100 | ~29 KB |
| `tb_vendas` | 1.000 | ~24 KB |
| `tb_itens_vendas` | 3.000 | ~155 KB |

**Total bruto: ~225 KB**
**+ 30% overhead (índices, metadados): ~293 KB**

> Volume estimado total: aproximadamente **300 KB**.

* **Quantidade estimada de usuários**: 2
* **Principais consultas realizadas**:
``` sql
-- Usuário realizando login
SELECT * FROM TB_USUARIOS WHERE EMAIL = 'admin@email.com';

-- Itens
---- Buscando todos os itens cadastrados
SELECT * FROM TB_ITENS;

---- Cadastrando um novo item
INSERT INTO
	PUBLIC.TB_ITENS (CODIGO, NOME, QUANTIA, VALOR)
VALUES
	('ES-0010', 'FITA DUREX', 23.00, 19.00);


-- Vendas
---- Buscar somente as vendas, sem os itens
SELECT
    V.ID AS ID,
    (U.NOME || ' ' || U.SOBRENOME) AS VENDEDOR,
    (C.NOME || ' ' || C.SOBRENOME) AS CLIENTE,
    SUM(IV.QUANTIA * IV.VALOR) AS TOTAL_VENDA,
    V.DATA_VENDA AS DATA_VENDA
FROM
    TB_VENDAS AS V
    LEFT JOIN TB_USUARIOS AS U ON V.USUARIO_ID = U.ID
    LEFT JOIN TB_CLIENTES AS C ON V.CLIENTE_ID = C.ID
    LEFT JOIN TB_ITENS_VENDAS AS IV ON IV.VENDA_ID = V.ID
GROUP BY
    V.ID,
    U.NOME,
    U.SOBRENOME,
    C.NOME,
    C.SOBRENOME,
    V.DATA_VENDA;

---- Buscar os itens de uma venda
SELECT
	IV.VENDA_ID AS VENDA,
	IV.ID AS ID,
	IV.ITEM_ID AS CODIGO_ITEM,
	I.NOME AS ITEM,
	IV.QUANTIA AS QUANTIA,
	IV.VALOR AS VALOR,
	(IV.QUANTIA * IV.VALOR) AS VALOR_TOTAL
FROM
	TB_ITENS_VENDAS AS IV
	LEFT JOIN TB_ITENS AS I ON IV.ITEM_ID = I.CODIGO
WHERE
	VENDA_ID = 2;
```
