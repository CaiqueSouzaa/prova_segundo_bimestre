# Implantação de Servidores
## 1. Identificação do Projeto
* **Título**: Sistema de Vendas
* **Descrição**: Aplicação de vendas para ajudar no gerenciamento e melhor organização dos lucros.
* **Caminho Escolhido**: Opção A (Docker/Orquestração Local)

## 2. Pré-requisitos
* **Lista de ferramentas necessárias instaladas no ambiente WSL2**: Docker Desktop
* **Configurações iniciais necessárias**: Inicializar o Docker na máquina host

## 3. Guia de Instalação e Execução ("How to Up")


> [!CAUTION]
> **NUNCA** comite senhas, chaves de API ou qualquer credencial real no repositório. O arquivo `.env` está listado no `.gitignore` exatamente para isso. Apenas o arquivo `.env.example` (com valores fictícios) deve ser versionado.

### Configurando as variáveis de ambiente

O projeto utiliza um arquivo `.env` na raiz para centralizar todas as credenciais e configurações sensíveis. Este arquivo é carregado automaticamente pelo serviço `node` via `env_file` no `docker-compose.yml` e consumido pela aplicação através do `@nestjs/config`.

#### Passo a passo

1. Copie o arquivo de exemplo para criar o seu `.env` local:

   ```bash
   cp .env.example .env
   ```

2. Abra o arquivo `.env` e preencha cada variável com os valores reais do seu ambiente:

   ```bash
   # .env  ← este arquivo NÃO deve ser commitado
   DB_HOST=postgres # Não modificar caso deseje utilizar o container PostgreSQL do projeto
   DB_PORT=5432 # Não modificar caso deseje utilizar o container PostgreSQL do projeto
   DB_DATABASE=nome_do_banco
   DB_USERNAME=seu_usuario
   DB_PASSWORD=sua_senha_segura
   ```

3. **Não compartilhe** o arquivo `.env` preenchido. Ele já está protegido pelo `.gitignore`.

#### Descrição das variáveis

| Variável | Descrição | Exemplo |
|---|---|---|
| `DB_HOST` | Host do banco de dados (nome do serviço Docker) | `postgres` |
| `DB_PORT` | Porta do PostgreSQL | `5432` |
| `DB_DATABASE` | Nome do banco de dados a ser criado/utilizado | `vendas_db` |
| `DB_USERNAME` | Usuário do PostgreSQL | `admin` |
| `DB_PASSWORD` | Senha do usuário do PostgreSQL | `s3nh@F0rte!` |

> **Como as variáveis são usadas:** o `docker-compose.yml` repassa `DB_PASSWORD`, `DB_USERNAME` e `DB_DATABASE` diretamente ao container `postgres` via `POSTGRES_PASSWORD`, `POSTGRES_USER` e `POSTGRES_DB`. O serviço `node` recebe o arquivo `.env` completo via `env_file`, tornando todas as variáveis disponíveis para a aplicação NestJS.

**Pré-requisito:** Docker Desktop instalado e em execução.

```bash
# 1. Clone o repositório
git clone <url-do-repositório>

# 2. Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais reais

# 4. Suba toda a infraestrutura (build + start + migrations)
docker compose up -d --build
```

> Após a execução, a API estará disponível em `http://localhost` e a documentação em `http://localhost/api-docs`.

## 4. Detalhamento Técnico da Infraestrutura

* **Otimização de Imagens**: O `Dockerfile` da aplicação foi devidamente otimizado com o uso de imagens leves baseadas em Alpine (`node:26-alpine`) em conjunto com a técnica de **Multi-stage build**. O primeiro estágio compila a aplicação, e o segundo estágio copia unicamente os binários de produção (`dist/` e `node_modules/` de runtime), descartando ferramentas de desenvolvimento e reduzindo drasticamente o tamanho da imagem gerada.

* **Persistência**: A estratégia de dados adotada baseia-se em **Named Volumes** no Docker. Foi criado o volume `postgres-data` que isola de forma permanente os dados do banco PostgreSQL. Mesmo que os containers caiam, sejam reiniciados ou atualizados, a integridade dos registros armazenados e das migrations está garantida.

* **Rede e Comunicação**: A infraestrutura conta com o uso de uma **rede customizada** nomeada `private-network`, que viabiliza o isolamento de tráfego e o **DNS Interno no Docker**. Serviços como a aplicação Node.js acessam o banco usando apenas o hostname (`postgres`), e o Nginx atua como proxy reverso roteando as requisições, não existindo a necessidade de IPs fixos no container.

* **Segurança**: O projeto faz forte uso de **variáveis de ambiente no arquivo .env** para desenvolvimento — ignorado pelo Git para evitar vazamento — e **Docker Secrets** para o orquestrador Swarm em produção. Além disso, de forma equivalente a Security Groups restritivos, a rede customizada isola as portas de comunicação interna de todo o ambiente host, sendo liberado acesso público somente à porta 80 por intermédio do proxy do Nginx.

## 5. Gestão de Segredos e Configurações
### Docker Compose

> [!CAUTION]
> **NUNCA** comite senhas, chaves de API ou qualquer credencial real no repositório. O arquivo `.env` está listado no `.gitignore` exatamente para isso. Apenas o arquivo `.env.example` (com valores fictícios) deve ser versionado.


1. Copie o arquivo de exemplo para criar o seu `.env` local:

   ```bash
   cp .env.example .env
   ```

2. Abra o arquivo `.env` e preencha cada variável com os valores reais do seu ambiente:

   ```bash
   # .env  ← este arquivo NÃO deve ser commitado
   DB_HOST=postgres # Não modificar caso deseje utilizar o container PostgreSQL do projeto
   DB_PORT=5432 # Não modificar caso deseje utilizar o container PostgreSQL do projeto
   DB_DATABASE=nome_do_banco
   DB_USERNAME=seu_usuario
   DB_PASSWORD=sua_senha_segura
   ```


### Docker Swarm

Inicializar o Docker Swarm:
```bash
docker swarm init
```

É necessário realizar o build das imagens a partir dos Dockerfiles:
```bash
# Constrói a imagem do Node
docker build -t prova_segundo_bimestre_node:latest .

# Constrói a imagem do Nginx
docker build -t prova_segundo_bimestre_nginx:latest -f Dockerfile.nginx .
```

### Criação das secrets

Utilize os mesmos valores salvos no arquivo `.env`.

> ⚠️ **Atenção:** confira se o nome de cada secret (`db_password`, `db_username`, `db_database`) corresponde de fato ao valor informado — abaixo os rótulos não batem com os valores/nomes de secret usados nos comandos originais.

Nome do banco de dados:
```bash
echo -n "db_vendas_example" | docker secret create db_database -
```

Usuário do banco de dados:
```bash
echo -n "vendas_example" | docker secret create db_username -
```

Senha do banco de dados:
```bash
echo -n "Vendas@123_example" | docker secret create db_password -
```

### Deploy da aplicação

```bash
docker stack deploy -c docker-stack.yml app_segundo_bimestre
```

Verificar se todos os serviços estão rodando corretamente:
```bash
docker service ls
```

### Finalizar uma aplicação
```bash
docker stack rm app_segundo_bimestre
```


## 6. Evidências de Funcionamento e Verificação

### 6.1 Verificar containers em execução

Confirme que todos os 3 serviços (`postgres`, `node`, `nginx`) estão com status **Up**:

```bash
docker compose ps
```

Saída esperada:

```
NAME                      STATUS          PORTS
prova_segundo_bimestre-nginx-1      Up      0.0.0.0:80->80/tcp
prova_segundo_bimestre-node-1       Up
prova_segundo_bimestre-postgres-1   Up      5432/tcp
```

### 6.2 Inspecionar logs dos serviços

```bash
# Logs de todos os serviços (tempo real)
docker compose logs -f

# Apenas a aplicação Node.js
docker compose logs -f node

# Apenas o banco de dados
docker compose logs -f postgres
```

### 6.3 Verificar rede e comunicação interna

```bash
# Listar redes Docker e confirmar a rede privada do projeto
docker network ls

# Inspecionar a rede criada pelo compose (substitua pelo nome real, ex: prova_segundo_bimestre_private-network)
docker network inspect prova_segundo_bimestre_private-network
```

### 6.4 Verificar volume de persistência

```bash
# Listar volumes Docker e confirmar o volume do PostgreSQL
docker volume ls

# Inspecionar o volume (confirma que os dados persistem)
docker volume inspect prova_segundo_bimestre_postgres-data
```

### 6.5 Acesso à aplicação e documentação da API

| Serviço | URL | Descrição |
|---|---|---|
| Aplicação (via Nginx) | `http://localhost` | Entrada principal da API |
| Documentação Swagger | `http://localhost/api-docs` | Interface interativa da API ✅ |

## 7. Troubleshooting e Limpeza

### Problemas comuns

| Sintoma | Causa provável | Solução |
|---|---|---|
| Container `node` reinicia em loop | Banco ainda não está pronto | Aguarde o `postgres` subir; o `depends_on` garante a ordem mas não a prontidão |
| `Error: password authentication failed` | Credenciais no `.env` não batem com o volume existente | Rode `docker compose down -v` para apagar o volume e suba novamente |
| Nginx retorna 502 Bad Gateway | Serviço `node` ainda está inicializando | Aguarde alguns segundos e recarregue |
| Porta 80 já em uso | Outro processo usando a porta | Pare o processo com `netstat -ano` ou mude a porta no `docker-compose.yml` |

### Inspecionar um container específico

```bash
# Ver logs em tempo real de um serviço
docker compose logs -f node

# Abrir terminal interativo dentro do container
docker compose exec node sh
```

### Limpeza após avaliação

```bash
# Para e remove containers, redes e volumes (apaga os dados do banco)
docker compose down -v

# Remove também as imagens buildadas localmente
docker compose down -v --rmi local

# Remove a stack
docker stack rm app_segundo_bimestre

# Remove as secrets
docker secret rm db_database
docker secret rm db_password
docker secret rm db_username

# Sair do Docker Swarm
docker swarm leave --force

# Remove networks não utilizadas
docker network prune -f

# Remove volumes não utilizados (cuidado com dados)
docker volume prune -f

# Remove todos os volumes órfãos
docker volume rm $(docker volume ls -qf dangling=true)

# Remove imagens não utilizadas
docker image prune -a -f
```


---

# Banco de Dados
 
Todos os requisitos técnicos solicitados foram implementados e organizados conforme a estrutura de pastas especificada:
 
- **Arquitetura, justificativa técnica e normalização:** `./justificativa/arquitetura.md`
- **Modelagem** (DER, modelo lógico e dicionário de dados): `./modelagem/`
- **Scripts DDL** (criação de tabelas, constraints e índices): `./scripts/setup.sql`
- **Seed** (carga inicial com mais de 100 registros): `./scripts/seed/seed.sql`
- **Queries** (CRUD, consultas avançadas e agregações): `./queries/`
- **Inicialização Automática e Segurança (.env):** O script `scripts/init-collection.js` utiliza o driver `pg` para automatizar a leitura do arquivo `.env` e a execução sequencial do `setup.sql` e `seed.sql`, de forma segura e parametrizada.

# Desenvolvimento Web

API RESTful para controle de vendas e estoque, construída com **NestJS**, **TypeORM** e **PostgreSQL**, com autenticação via **JWT** e documentação interativa via **Swagger**.

---

## Sumário

- [Visão Geral](#visão-geral)
- [Bibliotecas Utilizadas](#bibliotecas-utilizadas)
- [Containers Docker](#containers-docker)
- [Configuração do Projeto](#configuração-do-projeto)
- [Executando com Docker](#executando-com-docker)
- [Entrypoints e Comandos CLI](#entrypoints-e-comandos-cli)
- [Autenticação JWT](#autenticação-jwt)
- [Documentação Swagger](#documentação-swagger)
- [ORM Utilizado — TypeORM vs Sequelize](#orm-utilizado--typeorm-vs-sequelize)
- [Entidades e Relacionamentos](#entidades-e-relacionamentos)

---

## Visão Geral

O sistema permite que usuários autenticados gerenciem clientes, itens e vendas, realizando operações de criação, leitura, atualização e remoção (CRUD) em todas as entidades principais.

---

## Bibliotecas Utilizadas

| Biblioteca | Finalidade |
|---|---|
| `@nestjs/typeorm` + `typeorm` | ORM e integração com NestJS |
| `pg` | Driver para PostgreSQL |
| `typescript` | Tipagem estática em tempo de transpilação |
| `@nestjs/jwt` | Autenticação via JSON Web Token |
| `bcrypt` | Geração e comparação de senhas seguras |
| `@nestjs/config` | Gerenciamento de variáveis de ambiente |
| `@nestjs/swagger` | Documentação interativa da API |

---

## Containers Docker

| Container | Imagem | Origem |
|---|---|---|
| Banco de dados | `postgres:17` | Baixada diretamente no `docker-compose.yml` |
| Aplicação Node | `node:26-alpine` | Build via `Dockerfile`, referenciada como `node` |
| Proxy reverso | `nginx:latest` | Build via `Dockerfile`, referenciada como `nginx` |

---

## Configuração do Projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/CaiqueSouzaa/prova_segundo_bimestre.git
cd prova_segundo_bimestre
```

### 2. Configurar o arquivo `.env`

Copie o arquivo de exemplo e preencha com os seus dados de conexão:

**Linux/Mac**
```bash
cp .env.example .env
```

**Windows**
```bash
copy .env.example .env
```

Edite o `.env` com as variáveis adequadas:

```env
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=db_vendas
DB_USERNAME=vendas_user
DB_PASSWORD=sua_senha_aqui

JWT_SECRET=sua_chave_secreta_aqui
```

### 3. Instalar as dependências
Ignore este processo caso deseje executar o projeto em Docker.

```bash
npm install
```

> ℹ️ **Docker:** o banco de dados e o usuário são criados automaticamente — não é necessária nenhuma configuração prévia no banco.  
> ⚙️ **Sem Docker:** o banco e o usuário já devem existir antes de iniciar a aplicação.

> ⚠️ Nunca utilize valores sensíveis em produção. Certifique-se de que o `.env` está no `.gitignore`.

### 4. Migrations

As migrations são executadas **automaticamente** ao iniciar o servidor. Para executá-las manualmente, veja a seção [Entrypoints e Comandos CLI](#entrypoints-e-comandos-cli).

### 5. Seeds (dados fakes)

Diferentemente das migrations, as seeds **não são executadas automaticamente** — é necessário rodá-las manualmente após o servidor estar de pé (ou após as migrations terem sido aplicadas):

```bash
# Com Docker
docker compose run runner node command.js seed

# Sem Docker
node command.js seed
```

> Isso populará o banco com dados fakes, incluindo o usuário de teste usado na seção [Documentação Swagger](#documentação-swagger) (`admin@email.com` / `Admin@123`).

---

## Executando com Docker

```bash
# Build e inicialização de todos os serviços
docker compose up -d --build

# Parar os containers (mantém os dados)
docker compose stop

# Remover os containers (mantém os volumes)
docker compose down

# Remover containers e volumes (apaga os dados do banco)
docker compose down -v
```

---

## Entrypoints e Comandos CLI

O projeto possui dois entrypoints na raiz:

### `server.js` — Servidor Web
Em caso de execução através do Docker, o "server.js" é inicializado automaticamente, não sendo necessário sua execução.

Inicia o servidor NestJS (requer build prévia):

```bash
# 1. Gerar o build de produção
npm run build

# 2. Iniciar o servidor
node server.js
```

> Em desenvolvimento, use `npm run start:dev` para hot-reload.

### `command.js` — Comandos Administrativos

Executa tarefas administrativas via linha de comando:

```bash
node command.js <comando>
```

| Comando | Descrição |
|---|---|
| `migrate` | Executa todas as migrations pendentes |
| `migration:generate` | Cria uma nova migration |
| `seed` | Realiza a inserção de dados fakes no banco de dados |

**Exemplos:**

Em caso de execução via Docker, executar os comandos da seguinte forma:
```bash
# Executar migrations pendentes
docker compose run runner node command.js migrate

# Gerar uma nova migration
docker compose run runner node command.js migration:generate

# Executar seeds de dados fake
docker compose run runner node command.js seed
```

```bash
# Executar migrations pendentes
node command.js migrate

# Gerar uma nova migration
node command.js migration:generate

# Executar seeds de dados fake
node command.js seed
```

> **Nota:** O comando `migrate` utiliza diretamente o TypeORM com o data-source em `data-source.ts`. Não exige build prévia — apenas `npm install` e o `.env` configurado.

---

## Autenticação JWT

### Login

| | Docker Compose | Sem Docker |
|---|---|---|
| **URL** | `http://localhost/login` | `http://localhost:3000/login` |

**Exemplo de requisição:**

```http
POST http://localhost/login
Content-Type: application/json

{
  "email": "admin@admin.com",
  "senha": "Senha"
}
```

**Resposta:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Usando o token

Inclua o token em todas as requisições protegidas via header:

```
Authorization: Bearer <seu_token_aqui>
```

---

## Documentação Swagger

A documentação interativa está disponível após iniciar a aplicação:

| Modo de execução | URL |
|---|---|
| Docker Compose | [http://localhost/api-docs](http://localhost/api-docs) |
| Sem Docker | [http://localhost:3000/api-docs](http://localhost:3000/api-docs) |

Gerada automaticamente pelo `@nestjs/swagger` a partir das anotações nos controllers, permite visualizar e testar todas as rotas diretamente pelo navegador.

### Credenciais para testes (apenas desenvolvimento)

| Campo | Valor |
|---|---|
| Email | `admin@email.com` |
| Senha | `Admin@123` |

> ⚠️ Essas credenciais existem **apenas em ambiente local** (via seed). Nunca as utilize em produção.

Após obter o token, insira-o no campo **Authorize → Value** no Swagger. O prefixo `Bearer` é adicionado automaticamente.

---

## ORM Utilizado — TypeORM vs Sequelize

Este projeto utiliza o **TypeORM** como ORM (Object-Relational Mapper) em vez do Sequelize. Ambas são soluções consolidadas para Node.js que abstraem a comunicação com bancos de dados relacionais, mas diferem em alguns aspectos importantes:

| Característica | TypeORM | Sequelize |
|---|---|---|
| **Linguagem principal** | TypeScript (nativo) | JavaScript (suporte a TS via pacotes externos) |
| **Definição de modelos** | Decorators nas classes (`@Entity`, `@Column`, etc.) | Objetos de configuração ou classes com `Model.init()` |
| **Equivalente ao Model** | `Entity` | `Model` |
| **Migrations** | Geradas automaticamente a partir das entidades | Criadas manualmente ou via CLI |
| **Integração com NestJS** | Oficial (`@nestjs/typeorm`) | Possível, porém sem pacote oficial do ecossistema Nest |
| **Padrão de repositório** | Nativo (`Repository<T>`) | Não nativo (requer implementação manual) |

### Equivalência: Entities (TypeORM) = Models (Sequelize)

No Sequelize, os **Models** definem a estrutura das tabelas e são o ponto central de interação com o banco. No TypeORM, esse papel é exercido pelas **Entities** — classes TypeScript decoradas com `@Entity()` que mapeiam diretamente para as tabelas do banco de dados.

As entities deste projeto estão localizadas em:

```
src/entities/
```

Cada arquivo nesse diretório corresponde a uma entidade do sistema (Cliente, Usuario, Item, Venda e ItemVenda) e define os campos, tipos e relacionamentos da respectiva tabela, de forma equivalente ao que seria um Model no Sequelize.

### Migrations

As migrations descrevem as alterações estruturais no banco de dados (criação de tabelas, adição de colunas, etc.) de forma versionada e rastreável. No TypeORM, elas podem ser geradas automaticamente a partir das entities, diferentemente do Sequelize, onde geralmente são escritas manualmente.

As migrations deste projeto estão localizadas em:

```
migrations/
```

Elas são executadas **automaticamente** na inicialização do servidor, sem necessidade de intervenção manual. Caso queira executá-las manualmente, consulte a seção [Entrypoints e Comandos CLI](#entrypoints-e-comandos-cli).

### Seeds

Existe atualmente o seed para dados fakes, o qual deve ser executado manualmente após a inicialização do servidor ou execução das migrations.

---

## Entidades e Relacionamentos

| Entidade | Tabela | Chave primária | Descrição |
|---|---|---|---|
| **Cliente** | `tb_clientes` | `id` (auto-increment) | Clientes que realizam compras |
| **Usuario** | `tb_usuarios` | `id` (auto-increment) | Usuários que manipulam o sistema (CRUD) |
| **Item** | `tb_itens` | `codigo` (string, manual) | Itens disponíveis para venda |
| **Venda** | `tb_vendas` | `id` (auto-increment) | Vendas realizadas no sistema |
| **ItemVenda** | `tb_itens_vendas` | `id` (auto-increment) | Tabela pivô — relação N:N entre Venda e Item |

Os arquivos das entities estão localizados em `src/entities/` e correspondem cada um a uma das tabelas acima.

---

### Detalhamento das Entities

#### Cliente (`src/entities/cliente.ts`)

| Coluna | Tipo | Restrições |
|---|---|---|
| `id` | `integer` | PK, auto-increment |
| `cpf` | `string` | NOT NULL, UNIQUE |
| `nome` | `string` | NOT NULL |
| `sobrenome` | `string` | NOT NULL |

Não possui relacionamentos declarados na própria entity — é referenciada por **Venda**.

---

#### Usuario (`src/entities/usuario.ts`)

| Coluna | Tipo | Restrições |
|---|---|---|
| `id` | `integer` | PK, auto-increment |
| `email` | `string` | NOT NULL, UNIQUE |
| `senha` | `string` | NOT NULL |
| `nome` | `string` | NOT NULL |
| `sobrenome` | `string` | NOT NULL |

Não possui relacionamentos declarados na própria entity — é referenciada por **Venda**.

---

#### Item (`src/entities/item.ts`)

| Coluna | Tipo | Restrições |
|---|---|---|
| `codigo` | `string` | PK (definido manualmente via `@PrimaryColumn`) |
| `nome` | `string` | NOT NULL |
| `quantia` | `decimal(10,2)` | NOT NULL, default `0.00` |
| `valor` | `decimal(10,2)` | NOT NULL, default `0.00` |

Não possui relacionamentos declarados na própria entity — é referenciada por **ItemVenda**.

> **Observação:** diferentemente das demais entidades, a chave primária de `Item` é o campo `codigo` (string), definido manualmente via `@PrimaryColumn()`, e não gerado automaticamente.

---

#### Venda (`src/entities/venda.ts`)

| Coluna | Tipo | Restrições |
|---|---|---|
| `id` | `integer` | PK, auto-increment |
| `cliente_id` | FK → `tb_clientes` | Nullable — `SET NULL` ao deletar/atualizar |
| `usuario_id` | FK → `tb_usuarios` | NOT NULL — `SET NULL` ao deletar/atualizar |
| `data_venda` | `timestamp` | NOT NULL, preenchido automaticamente na criação |

**Relacionamentos:**

| Tipo | Entidade relacionada | Coluna FK | Comportamento |
|---|---|---|---|
| `ManyToOne` | **Cliente** | `cliente_id` | Nullable — se o cliente for deletado, a FK é definida como `NULL` |
| `ManyToOne` | **Usuario** | `usuario_id` | Se o usuário for deletado, a FK é definida como `NULL` |
| `OneToMany` | **ItemVenda** | — | Uma venda pode ter múltiplos itens (acesso via propriedade `itens`) |

**Índices:**

| Nome do índice | Coluna(s) |
|---|---|
| `idx_tb_vendas_data_venda` | `data_venda` |
| `idx_tb_vendas_cliente_id` | `cliente_id` |

---

#### ItemVenda (`src/entities/item-venda.ts`) — Tabela Pivô N:N

| Coluna | Tipo | Restrições |
|---|---|---|
| `id` | `integer` | PK, auto-increment |
| `venda_id` | FK → `tb_vendas` | NOT NULL — `CASCADE` ao deletar/atualizar |
| `item_id` | FK → `tb_itens` | NOT NULL — `CASCADE` ao deletar/atualizar |
| `quantia` | `decimal(10,2)` | NOT NULL, default `0.00` |
| `valor` | `decimal(10,2)` | NOT NULL, default `0.00` |

**Relacionamentos:**

| Tipo | Entidade relacionada | Coluna FK | Comportamento |
|---|---|---|---|
| `ManyToOne` | **Venda** | `venda_id` | Se a venda for deletada, os registros de `ItemVenda` são deletados em cascata |
| `ManyToOne` | **Item** | `item_id` | Se o item for deletado, os registros de `ItemVenda` são deletados em cascata |

**Índices:**

| Nome do índice | Coluna(s) |
|---|---|
| `idx_tb_itens_vendas_venda_id` | `venda_id` |

---

### Visão Geral dos Relacionamentos

```
Cliente ──────────────────────────────┐
                                      │ ManyToOne (nullable, SET NULL)
                               ┌──────▼──────┐
Usuario ──── ManyToOne ───────►│    Venda    │
(SET NULL)                     └──────┬──────┘
                                      │ OneToMany
                               ┌──────▼──────┐
                               │  ItemVenda  │◄──── ManyToOne ──── Item
                               │ (tb pivô)   │      (CASCADE)
                               └─────────────┘
```

A entidade **ItemVenda** é a **tabela pivô** que implementa a relação N:N entre `Venda` e `Item`: uma venda pode conter múltiplos itens, e um mesmo item pode aparecer em múltiplas vendas. Além das chaves estrangeiras, a tabela pivô armazena `quantia` e `valor` — dados específicos de cada item dentro de uma venda.