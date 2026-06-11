# 1. Definição da Arquitetura

## 1.1 Escolha Tecnológica
- **Tipo de banco escolhido:** SQL (Relacional)
- **Provedor utilizado:** PostgreSQL
- **Justificativa técnica da escolha:** O sistema de vendas possui entidades fortemente relacionadas (Clientes, Usuários, Vendas e Itens) onde a consistência dos dados e o cumprimento das propriedades ACID (Atomicidade, Consistência, Isolamento e Durabilidade) são essenciais. Além disso, as consultas envolvem agregações e joins (ex: relatórios de vendas, itens por venda), o que é muito bem suportado e otimizado por bancos de dados relacionais. O PostgreSQL foi escolhido por ser open-source, robusto, altamente escalável e por possuir excelente suporte a transações e integridade referencial, além de se integrar perfeitamente ao TypeORM já utilizado no projeto.

## 1.2 Requisitos do Sistema
- **Objetivo do sistema:** Gerenciamento e organização das vendas e lucros de um negócio, permitindo o controle de clientes, usuários (funcionários), catálogo de itens e registro detalhado de cada venda realizada.
- **Principais entidades:** `Cliente`, `Usuario`, `Item`, `Venda` e `ItemVenda`.
- **Volume estimado de dados:** Espera-se um volume moderado a alto de inserções diárias na tabela de vendas e itens de vendas. Estima-se 10.000 a 50.000 registros de vendas por ano.
- **Quantidade estimada de usuários:** 10 a 50 funcionários (usuários do sistema) simultâneos, além de uma base de milhares de clientes cadastrados.
- **Principais consultas realizadas:**
  - Relatório de vendas por período.
  - Relatório de vendas por cliente.
  - Cálculo do ticket médio e total arrecadado.
  - Controle de estoque (quantia de itens vendidos vs disponíveis).
  - Consulta do histórico de um cliente utilizando o CPF.

# 3. Modelagem e Normalização

- **1FN (Primeira Forma Normal):** Todos os atributos são atômicos. Por exemplo, os nomes e sobrenomes foram separados em colunas distintas (`nome` e `sobrenome`) nas tabelas de clientes e usuários. Não existem grupos repetitivos.
- **2FN (Segunda Forma Normal):** O modelo está na 1FN e todos os atributos não-chave dependem totalmente das chaves primárias. A tabela `tb_itens_vendas` possui sua própria chave primária (`id`) e faz referência às chaves primárias de Venda e Item.
- **3FN (Terceira Forma Normal):** O modelo está na 2FN e não existem dependências transitivas. Cada coluna não-chave depende exclusivamente da chave primária de sua tabela. Valores de preço na tabela `tb_itens_vendas` (valor) são copiados (históricos) da tabela `tb_itens` no momento da venda, garantindo que alterações futuras no preço do item não alterem o histórico de vendas passadas. Isso é uma prática padrão que não fere a normalização no contexto temporal/histórico, pois o valor no item-venda representa o "valor cobrado no momento da venda".

**Desnormalização:** Não há desnormalizações aplicadas na base, uma vez que o volume de leitura e escrita atende bem ao modelo normalizado, onde os `JOIN`s resolvem as necessidades sem problemas de performance e o foco principal é garantir a integridade e evitar anomalias de atualização.

# 4. Performance

## Estratégia de Indexação

Para garantir a performance nas consultas críticas, os seguintes índices foram propostos (detalhados também no DDL `scripts/setup.sql`):

| Campo | Tipo de Índice | Motivo |
| :--- | :--- | :--- |
| `cpf` (tb_clientes) | B-Tree (Unique) | Busca frequente de clientes por CPF, garantindo unicidade na tabela. |
| `email` (tb_usuarios) | B-Tree (Unique) | Autenticação do sistema e busca rápida de usuários pelo e-mail. |
| `data_venda` (tb_vendas)| B-Tree | Filtros essenciais para relatórios de vendas por período e ordenação. |
| `cliente_id` (tb_vendas)| B-Tree (FK) | Agiliza os JOINs entre Vendas e Clientes para resgatar históricos. |
| `venda_id` (tb_itens_vendas)| B-Tree (FK) | Otimiza o JOIN ao buscar rapidamente todos os itens de uma venda. |
