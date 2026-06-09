# 1. Definição da Arquitetura
## 1.1 Escolha Tecnológica
* **Tipo de banco escolhido (SQL ou NoSQL)**: SQL
* **Provedor utilizado (PostgreSQL, MySQL, SQL Server, MongoDB, Redis, DynamoDB, etc.)**: PostgreSQL
* **Justificativa técnica da escolha**: PostgreSQL foi escolhido por ser um banco relacional robusto com total conformidade ACID, ideal para dados estruturados com relacionamentos bem definidos. Além do modelo relacional tradicional, oferece suporte nativo a JSON, o que adiciona flexibilidade sem abrir mão da consistência. É open-source, amplamente adotado em produção e conta com ecossistema maduro de ferramentas e integrações.
## 1.2 Requisitos do Sistema
Descrever:
* **Objetivo do sistema**: Facilitar o gerenciamento financeiro do comércio;
* Principais entidades ou documentos.
* Volume estimado de dados.
* Quantidade estimada de usuários.
* Principais consultas realizadas.

# 2. Modelagem e Estrutura
## Implementação

### Scripts DDL

Scripts DDL (*Data Definition Language*) são responsáveis por definir a estrutura do banco de dados — criação de tabelas, tipos de dados, restrições e relacionamentos. Abaixo estão todos os scripts utilizados na implementação do banco de dados.

#### Criação das Tabelas

```sql
CREATE TABLE "tb_usuarios" (
  "id" integer PRIMARY KEY,
  "email" varchar(100) UNIQUE NOT NULL,
  "senha" varchar(250) NOT NULL,
  "nome" varchar(50) NOT NULL,
  "sobrenome" varchar(100) NOT NULL
);

CREATE TABLE "tb_itens" (
  "codigo" varchar(25) PRIMARY KEY,
  "nome" varchar(250) NOT NULL,
  "quantia" decimal(10,2) NOT NULL DEFAULT 0,
  "valor" decimal(10,2) NOT NULL DEFAULT 0
);

CREATE TABLE "tb_clientes" (
  "id" integer PRIMARY KEY,
  "cpf" varchar(11) UNIQUE NOT NULL,
  "nome" varchar(50) NOT NULL,
  "sobrenome" varchar(100) NOT NULL
);

CREATE TABLE "tb_vendas" (
  "id" integer PRIMARY KEY,
  "cliente_id" integer,
  "usuario_id" integer NOT NULL,
  "data_venda" timestamp NOT NULL
);

CREATE TABLE "tb_itens_vendas" (
  "id" integer PRIMARY KEY,
  "venda_id" integer NOT NULL,
  "item_codigo" varchar(25) NOT NULL,
  "quantia" decimal(10,2) NOT NULL DEFAULT 0,
  "valor" decimal(10,2) NOT NULL DEFAULT 0
);
```

#### Criação do Índice

```sql
CREATE INDEX "idx_itens_vendas_venda_id_item_codigo"
  ON "tb_itens_vendas" ("venda_id", "item_codigo");
```

#### Adição das Chaves Estrangeiras

```sql
ALTER TABLE "tb_itens_vendas"
  ADD FOREIGN KEY ("venda_id")
  REFERENCES "tb_vendas" ("id")
  DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "tb_vendas"
  ADD FOREIGN KEY ("cliente_id")
  REFERENCES "tb_clientes" ("id")
  DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "tb_vendas"
  ADD FOREIGN KEY ("usuario_id")
  REFERENCES "tb_usuarios" ("id")
  DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "tb_itens_vendas"
  ADD FOREIGN KEY ("item_codigo")
  REFERENCES "tb_itens" ("codigo")
  DEFERRABLE INITIALLY IMMEDIATE;
```

---

### Chaves Primárias

Chaves primárias (*Primary Keys* — PK) identificam de forma única cada registro em uma tabela. Nenhuma coluna definida como PK pode conter valores nulos ou duplicados.

| Tabela | Coluna PK | Tipo |
|---|---|---|
| `tb_usuarios` | `id` | integer |
| `tb_itens` | `codigo` | varchar(25) |
| `tb_clientes` | `id` | integer |
| `tb_vendas` | `id` | integer |
| `tb_itens_vendas` | `id` | integer |

**Observações:**

- A tabela `tb_itens` utiliza a coluna `codigo` como chave primária em vez de um `id` numérico, pois o código do item já é um identificador natural e único do produto no estoque.
- As demais tabelas utilizam a coluna `id` do tipo `integer` como identificador numérico sequencial.

---

### Chaves Estrangeiras

Chaves estrangeiras (*Foreign Keys* — FK) garantem a integridade referencial entre as tabelas, assegurando que um valor inserido em uma coluna FK sempre corresponda a um registro existente na tabela referenciada.

Todas as FKs foram definidas com a cláusula `DEFERRABLE INITIALLY IMMEDIATE`, o que significa que a verificação da integridade referencial ocorre no momento de cada instrução (comportamento padrão), mas pode ser adiada para o fim da transação caso necessário.

| Tabela | Coluna FK | Referencia | Coluna Referenciada | Nulável |
|---|---|---|---|---|
| `tb_vendas` | `cliente_id` | `tb_clientes` | `id` | Sim |
| `tb_vendas` | `usuario_id` | `tb_usuarios` | `id` | Não |
| `tb_itens_vendas` | `venda_id` | `tb_vendas` | `id` | Não |
| `tb_itens_vendas` | `item_codigo` | `tb_itens` | `codigo` | Não |

**Observações:**

- A FK `cliente_id` em `tb_vendas` é **nulável** intencionalmente, pois o sistema permite a realização de vendas para clientes não cadastrados.
- A FK `usuario_id` em `tb_vendas` é **obrigatória** (`NOT NULL`), garantindo que toda venda esteja sempre associada a um usuário do sistema responsável pelo registro.

---

### Constraints

Constraints são restrições aplicadas às colunas para garantir a integridade e a consistência dos dados. A tabela abaixo resume todas as constraints aplicadas em cada tabela.

#### tb_usuarios

| Coluna | Constraints | Descrição |
|---|---|---|
| `id` | PRIMARY KEY | Identificador único do usuário |
| `email` | UNIQUE, NOT NULL | E-mail único usado para login |
| `senha` | NOT NULL | Senha do usuário (armazenada em bcrypt) |
| `nome` | NOT NULL | Nome do usuário |
| `sobrenome` | NOT NULL | Sobrenome do usuário |

#### tb_itens

| Coluna | Constraints | Descrição |
|---|---|---|
| `codigo` | PRIMARY KEY | Código único do item |
| `nome` | NOT NULL | Nome do item |
| `quantia` | NOT NULL, DEFAULT 0 | Quantidade em estoque; inicia em zero |
| `valor` | NOT NULL, DEFAULT 0 | Valor base do item; inicia em zero |

#### tb_clientes

| Coluna | Constraints | Descrição |
|---|---|---|
| `id` | PRIMARY KEY | Identificador único do cliente |
| `cpf` | UNIQUE, NOT NULL | CPF único do cliente |
| `nome` | NOT NULL | Nome do cliente |
| `sobrenome` | NOT NULL | Sobrenome do cliente |

#### tb_vendas

| Coluna | Constraints | Descrição |
|---|---|---|
| `id` | PRIMARY KEY | Identificador único da venda |
| `cliente_id` | FK, NULL | Permite vendas sem cliente cadastrado |
| `usuario_id` | FK, NOT NULL | Usuário responsável pela venda é obrigatório |
| `data_venda` | NOT NULL | Data e hora da realização da venda |

#### tb_itens_vendas

| Coluna | Constraints | Descrição |
|---|---|---|
| `id` | PRIMARY KEY | Identificador único do registro |
| `venda_id` | FK, NOT NULL | Referência obrigatória à venda |
| `item_codigo` | FK, NOT NULL | Referência obrigatória ao item vendido |
| `quantia` | NOT NULL, DEFAULT 0 | Quantidade do item na venda; inicia em zero |
| `valor` | NOT NULL, DEFAULT 0 | Valor do item na venda (pode diferir do valor base) |

---

### Índices

Índices são estruturas auxiliares que aceleram a busca de registros em uma tabela, evitando varreduras completas (*full table scans*) em consultas frequentes.

#### Índice Criado

```sql
CREATE INDEX "idx_itens_vendas_venda_id_item_codigo"
  ON "tb_itens_vendas" ("venda_id", "item_codigo");
```

| Nome do Índice | Tabela | Colunas Indexadas | Tipo |
|---|---|---|---|
| `idx_itens_vendas_venda_id_item_codigo` | `tb_itens_vendas` | `venda_id`, `item_codigo` | Composto (não único) |

**Justificativa:**

O índice composto sobre `(venda_id, item_codigo)` foi criado na tabela `tb_itens_vendas` pois consultas a essa tabela frequentemente filtram ou fazem junções pelas duas colunas simultaneamente — por exemplo, ao buscar todos os itens de uma venda específica ou ao verificar se determinado item já está incluído em uma venda. O índice composto é mais eficiente que dois índices separados nesses casos, pois o banco de dados pode satisfazer ambos os critérios de busca em uma única varredura de índice.

> **Índices implícitos:** Além do índice explícito acima, o banco de dados cria automaticamente índices internos para todas as colunas definidas como `PRIMARY KEY` (`tb_usuarios.id`, `tb_itens.codigo`, `tb_clientes.id`, `tb_vendas.id`, `tb_itens_vendas.id`) e para as colunas com constraint `UNIQUE` (`tb_usuarios.email`, `tb_clientes.cpf`).

# 3. Modelagem e Normalização

## 1. Primeira Forma Normal (1FN)

### Definição

Uma tabela está na **1FN** quando satisfaz as seguintes condições:

- Cada coluna armazena apenas **valores atômicos** (indivisíveis), sem listas ou grupos repetidos em uma mesma célula.
- Cada coluna possui um **tipo de dado bem definido**.
- Cada linha é **única**, identificada por uma chave primária.

### Aplicação no banco de dados

Todas as tabelas do banco atendem à 1FN. A seguir, a justificativa para cada uma:

**tb_usuarios**
- Cada coluna (`id`, `email`, `senha`, `nome`, `sobrenome`) armazena um único valor atômico por linha.
- O nome e o sobrenome do usuário foram separados em colunas distintas — não existe um campo "nome completo" que concatenaria dois dados diferentes em uma única célula.
- A chave primária `id` garante a unicidade de cada linha.

**tb_clientes**
- Mesma estrutura de `tb_usuarios`: `nome` e `sobrenome` separados, `cpf` armazenado como valor único por linha.
- A chave primária `id` garante a unicidade de cada linha.

**tb_itens**
- Cada item possui uma única linha com seus atributos (`codigo`, `nome`, `quantia`, `valor`), sem grupos repetidos.
- A chave primária `codigo` garante a unicidade de cada linha.

**tb_vendas**
- Não armazena os itens da venda diretamente nesta tabela. Em vez disso, os itens foram deslocados para a tabela `tb_itens_vendas`, eliminando assim grupos repetidos que quebrariam a 1FN (por exemplo, não existe uma coluna `itens` contendo uma lista de produtos).
- A chave primária `id` garante a unicidade de cada linha.

**tb_itens_vendas**
- Cada linha representa **um item de uma venda**, com seus próprios valores de `quantia` e `valor`. Não há listas ou arrays em nenhuma coluna.
- A chave primária `id` garante a unicidade de cada linha.

### Conclusão

> O banco de dados **está na 1FN**. Todos os atributos são atômicos, as colunas possuem tipos bem definidos e todas as tabelas possuem chave primária.

---

## 2. Segunda Forma Normal (2FN)

### Definição

Uma tabela está na **2FN** quando:

- Já está na **1FN**.
- Todos os atributos não-chave dependem da **chave primária inteira**, e não apenas de parte dela. Este requisito é relevante apenas quando a chave primária é **composta** (formada por duas ou mais colunas).

### Aplicação no banco de dados

Nenhuma das tabelas do banco utiliza chave primária composta — todas as PKs são simples (`id` ou `codigo`). Por definição, quando a chave primária é simples, não é possível haver dependência parcial, pois não existe "parte da chave". Logo, todas as tabelas satisfazem automaticamente a 2FN.

Ainda assim, vale analisar a tabela que mais se aproximaria de um cenário com chave composta:

**tb_itens_vendas**

Esta é a tabela de junção entre `tb_vendas` e `tb_itens`. Ela poderia ter sido modelada com uma chave primária composta formada por `(venda_id, item_codigo)`. Nesse caso, seria necessário verificar se `quantia` e `valor` dependem da chave inteira ou apenas de uma parte:

- `quantia` — depende da combinação `(venda_id, item_codigo)`, pois representa a quantidade daquele item específico naquela venda específica.
- `valor` — depende da combinação `(venda_id, item_codigo)`, pois representa o valor cobrado por aquele item naquela venda específica.

Não há dependência parcial: nenhum atributo depende apenas de `venda_id` ou apenas de `item_codigo` isoladamente. A opção adotada foi utilizar um `id` simples como PK, o que também satisfaz a 2FN por não haver chave composta.

### Conclusão

> O banco de dados **está na 2FN**. Como todas as chaves primárias são simples, não existe a possibilidade de dependência parcial. A análise de `tb_itens_vendas` confirma que, mesmo no cenário hipotético de chave composta, a tabela ainda estaria na 2FN.

---

## 3. Terceira Forma Normal (3FN)

### Definição

Uma tabela está na **3FN** quando:

- Já está na **2FN**.
- Não existem **dependências transitivas**: nenhum atributo não-chave depende de outro atributo não-chave. Em outras palavras, todo atributo não-chave deve depender **direta e exclusivamente** da chave primária.

### Aplicação no banco de dados

**tb_usuarios**

| Atributo | Depende de |
|---|---|
| `email` | `id` (PK) |
| `senha` | `id` (PK) |
| `nome` | `id` (PK) |
| `sobrenome` | `id` (PK) |

Nenhum atributo depende de outro atributo não-chave. ✔

**tb_clientes**

| Atributo | Depende de |
|---|---|
| `cpf` | `id` (PK) |
| `nome` | `id` (PK) |
| `sobrenome` | `id` (PK) |

Nenhum atributo depende de outro atributo não-chave. ✔

**tb_itens**

| Atributo | Depende de |
|---|---|
| `nome` | `codigo` (PK) |
| `quantia` | `codigo` (PK) |
| `valor` | `codigo` (PK) |

Nenhum atributo depende de outro atributo não-chave. ✔

**tb_vendas**

| Atributo | Depende de |
|---|---|
| `cliente_id` | `id` (PK) |
| `usuario_id` | `id` (PK) |
| `data_venda` | `id` (PK) |

Nenhum atributo depende de outro atributo não-chave. ✔

**tb_itens_vendas**

| Atributo | Depende de |
|---|---|
| `venda_id` | `id` (PK) |
| `item_codigo` | `id` (PK) |
| `quantia` | `id` (PK) |
| `valor` | `id` (PK) |

Nenhum atributo depende de outro atributo não-chave. ✔

### Conclusão

> O banco de dados **está na 3FN**. Não existem dependências transitivas em nenhuma tabela — todos os atributos não-chave dependem única e diretamente da chave primária de sua respectiva tabela.

---

## 4. Desnormalização

### Existe desnormalização?

Sim. A coluna `valor` em `tb_itens_vendas` representa uma **desnormalização intencional e justificada**.

### Explicação

A tabela `tb_itens` já possui a coluna `valor`, que armazena o preço base de cada item. Numa modelagem estritamente normalizada, `tb_itens_vendas` não precisaria armazenar o valor novamente — bastaria consultar `tb_itens` pelo `item_codigo` para obter o preço.

Porém, a coluna `valor` em `tb_itens_vendas` **não é uma duplicação acidental**: ela armazena o valor **efetivamente cobrado** por aquele item naquela venda, que pode ser diferente do valor base atual do item em `tb_itens`.

### Motivo

O valor de um item no estoque pode ser alterado ao longo do tempo. Se `tb_itens_vendas` dependesse diretamente de `tb_itens.valor`, toda alteração de preço no estoque mudaria retroativamente o valor de vendas já realizadas, corrompendo o histórico financeiro do sistema. A coluna `valor` em `tb_itens_vendas` garante que o preço cobrado na venda seja **imutável após o registro**, preservando o histórico com fidelidade.

Essa decisão de design está explicitamente documentada no Dicionário de Dados:

> *"Por mais que exista o valor do item na tabela de itens, a coluna 'valor' em 'tb_itens_vendas' permite definir um valor personalizado para o item em questão."*

### Conclusão

> A desnormalização de `valor` em `tb_itens_vendas` é **proposital e necessária** para garantir a integridade do histórico de vendas, sendo uma prática amplamente adotada em sistemas comerciais e financeiros.

# Performance

## Estratégia de Indexação

| Campo | Tipo de Índice | Motivo |
|---|---|---|
| `tb_usuarios.id` | B-Tree (PK) | Busca por usuário |
| `tb_usuarios.email` | B-Tree (UNIQUE) | Busca por e-mail no login |
| `tb_clientes.id` | B-Tree (PK) | Busca por cliente |
| `tb_clientes.cpf` | B-Tree (UNIQUE) | Busca por CPF |
| `tb_itens.codigo` | B-Tree (PK) | Busca por código do item |
| `tb_vendas.id` | B-Tree (PK) | Busca por venda |
| `tb_itens_vendas.id` | B-Tree (PK) | Busca por item de venda |
| `tb_itens_vendas.venda_id`, `tb_itens_vendas.item_codigo` | B-Tree Composto | Busca dos itens de uma venda e JOINs com `tb_vendas` e `tb_itens` |
