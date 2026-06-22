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
echo -n "prova" | docker secret create db_database -
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

# Remove networks não utilizadas
docker network prune -f

# Remove volumes não utilizados (cuidado com dados)
docker volume prune -f

# Remove todos os volumes órfãos
docker volume rm $(docker volume ls -qf dangling=true)

# Remove imagens não utilizadas
docker image prune -a -f

# Remove a stack
docker stack rm app_segundo_bimestre

# Remove as secrets
docker secret rm db_database
docker secret rm db_password
docker secret rm db_username

# Sair do Docker Swarm
docker swarm leave --force
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
* **Descrição do sistema de APIs**
* **Entidades, tabelas e relacionamentos**
* **Indicação da tabela pivô e da relação N:N**
* **CRUD completo das entidades principais**
* **Containers utilizados no projeto**

## Configurações do projeto

Para que a aplicação inicie corretamente, é necessário configurar o arquivo `.env`:

1. Copie (ou renomeie) o arquivo `.env.example` para `.env`:
```bash
   cp .env.example .env
```
2. Substitua os valores das variáveis pelos dados de conexão do seu banco de dados.

> ℹ️ Se a aplicação for executada via Docker, o banco de dados e o usuário são criados automaticamente, não havendo necessidade de criá-los previamente. Caso a execução seja feita **fora do Docker**, é necessário que o banco e o usuário já existam antes de iniciar a aplicação.

### Exemplo

```bash
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=db_vendas
DB_USERNAME=vendas_user
DB_PASSWORD=sua_senha_aqui

JWT_SECRET=sua_chave_secreta_aqui
```

> ⚠️ Nunca utilize esses valores em produção e certifique-se de que o `.env` está listado no `.gitignore` para não ser versionado.

### Migrations

As migrations são executadas automaticamente na inicialização do servidor, não sendo necessária a execução manual. Caso deseje executá-las manualmente, o comando está disponível ao final do tópico "Desenvolvimento Web".

## Entrypoints e Commands

O projeto possui dois entrypoints definidos na raiz:

### `server.js` — Entrypoint do Servidor Web

Inicia o servidor web NestJS (requer build prévia):

```bash
# 1. Gerar o build de produção
npm run build

# 2. Iniciar o servidor
node server.js
```

> Em desenvolvimento, utilize `npm run start:dev` para hot-reload.

### `command.js` — Entrypoint de Comandos CLI

Permite executar comandos administrativos via linha de comando:

```bash
node command.js <comando>
```

#### Comandos disponíveis

| Comando | Descrição |
|---|---|
| `migrate` | Executa todas as migrations pendentes no banco de dados |
| `migration:generate` | Realiza a criação de uma nova migration para o banco de dados |

#### Exemplos de uso

```bash
# Executar as migrations
node command.js migrate
```

> **Nota:** O comando `migrate` usa diretamente o TypeORM com o data-source em `src/data-source.ts`, portanto não exige build prévia — apenas que as dependências estejam instaladas (`npm install`) e o arquivo `.env` esteja configurado.

---

## Bibliotecas utilizadas no projeto
O projeto foi construído utilizando o framework Nest.js, em conjunto com as bibliotecas:
* typeorm: ORM para manipulação do banco de dados;
* @nestjs/typeorm: Biblioteca para integrar o TypeORm ao Nest.js
* pg: Driver para acesso ao banco de dados PostgreSQL;
* typescript: Biblioteca para tipagem em tempo de transpilação do JavaScript;
* @nestjs/jwt: Bibliteca de Json Web Token para Nest.js;
* bcrypt: Biblioteca para geração e comparação de senhas seguras;
* @nestjs/config: Biblioteca para uso de variáveis de ambiente no Nest.js;
* @nestjs/swagger: Swagger para o Nest.js;

## Como realizar login e usar o token JWT

> **Nota:** a autenticação JWT está configurada no projeto mas a rota de login deve ser verificada no Swagger em `http://localhost/api-docs`.

Após obter o token, inclua-o nas requisições protegidas via header:

```
Authorization: Bearer <seu_token_aqui>
```

## Documentação Swagger

A documentação interativa da API está disponível em:

[http://localhost/api-docs](http://localhost/api-docs)

Gerada automaticamente pelo `@nestjs/swagger` a partir das anotações nos controllers, permite visualizar e testar todas as rotas diretamente pelo navegador.

### Autenticação para testes

Para testar as rotas protegidas, utilize as credenciais do usuário administrador seedado em ambiente de desenvolvimento:

| Campo | Valor |
|---|---|
| Email | `admin@email.com` |
| Senha | `Admin@123` |

> ⚠️ Essas credenciais devem existir **apenas em ambiente local/desenvolvimento** (via seed do banco). Nunca utilize essa combinação de email/senha em produção.

Após obter o token de sessão, copie-o e insira no campo **Authorize → Value**. Não é necessário incluir o prefixo `Bearer`, pois o Swagger o adiciona automaticamente.

## Como executar o projeto com Docker

```bash
# Build e start de todos os serviços
docker compose up -d --build

# Parar sem apagar dados
docker compose stop

# Parar e remover containers (mantém volumes)
docker compose down

# Parar e remover tudo, incluindo dados do banco
docker compose down -v
```

## Como executar as migrations pelo command

```bash
# Executar todas as migrations pendentes
node command.js migrate
```

### Como criar uma nova migration

```bash
# Cria uma nova migration
node command.js migration:generate
```