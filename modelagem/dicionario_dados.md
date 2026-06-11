# Dicionário de Dados

Abaixo está o detalhamento de cada entidade e seus atributos do banco de dados relacional (PostgreSQL).

## Tabela: `tb_clientes`
Armazena os dados dos clientes que realizam compras.
- `id` (integer, PK, auto-increment): Identificador único do cliente.
- `cpf` (varchar(14), unique, not null): CPF do cliente, utilizado para identificação.
- `nome` (varchar(100), not null): Nome do cliente.
- `sobrenome` (varchar(100), not null): Sobrenome do cliente.

## Tabela: `tb_usuarios`
Armazena os usuários (funcionários/administradores) do sistema.
- `id` (integer, PK, auto-increment): Identificador único do usuário.
- `email` (varchar(150), unique, not null): E-mail de login.
- `senha` (varchar(255), not null): Senha do usuário (em hash hash bcrypt).
- `nome` (varchar(100), not null): Nome do usuário.
- `sobrenome` (varchar(100), not null): Sobrenome do usuário.

## Tabela: `tb_itens`
Armazena os produtos/serviços disponíveis para venda.
- `codigo` (varchar(50), PK): Código identificador único do item (ex: código de barras ou SKU).
- `nome` (varchar(150), not null): Nome do item.
- `quantia` (decimal(10,2), not null, default 0): Quantidade disponível em estoque.
- `valor` (decimal(10,2), not null, default 0): Valor unitário atual do item.

## Tabela: `tb_vendas`
Armazena o cabeçalho/registro das vendas efetuadas.
- `id` (integer, PK, auto-increment): Identificador único da venda.
- `cliente_id` (integer, FK, nullable): Referência ao cliente (`tb_clientes.id`). Pode ser nulo (ON DELETE SET NULL).
- `usuario_id` (integer, FK, nullable): Referência ao usuário que registrou a venda (`tb_usuarios.id`). Pode ser nulo.
- `data_venda` (timestamp, not null, default CURRENT_TIMESTAMP): Data e hora em que a venda foi realizada.

## Tabela: `tb_itens_vendas`
Tabela pivô que relaciona `tb_vendas` e `tb_itens`, descrevendo os itens adquiridos em cada venda.
- `id` (integer, PK, auto-increment): Identificador único do registro.
- `venda_id` (integer, FK): Referência à venda (`tb_vendas.id`). (ON DELETE CASCADE)
- `item_id` (varchar(50), FK): Referência ao item (`tb_itens.codigo`). (ON DELETE CASCADE)
- `quantia` (decimal(10,2), not null): Quantidade deste item comprada na venda.
- `valor` (decimal(10,2), not null): Valor unitário do item no momento exato da venda.
