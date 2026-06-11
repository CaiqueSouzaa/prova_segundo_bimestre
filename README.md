# Implantação de Servidores
## 1. Identificação do Projeto
* **Título**: Sistema de Vendas
* **Descrição**: Aplicação de vendas para ajudar no gerenciamento e melhor organização dos lucros.
* **Caminho Escolhido**: Opção A (Docker/Orquestração Local)

## 2. Pré-requisitos
* **Lista de ferramentas necessárias instaladas no ambiente WSL2**: Docker Desktop
* **Configurações iniciais necessárias**: Inicializar o Docker na máquina host

## 3. Guia de Instalação e Execução ("How to Up")

**Pré-requisito:** Docker Desktop instalado e em execução.

```bash
# 1. Clone o repositório
git clone <url-do-repositório>

# 2. Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais reais

# 3. Sincronize o arquivo de senha do pgAdmin
cp pgadmin/pbpass.example pgadmin/pgpass
# Edite pgadmin/pgpass com os mesmos valores de DB_USERNAME e DB_PASSWORD do .env

# Certifique-se de que o nome de usuário do banco de dados salvo em "pgadmin/servers.json" corresponde exatamente do "DB_USERNAME"

# 4. Suba toda a infraestrutura (build + start + migrations)
docker compose up -d --build
```

> Após a execução, a API estará disponível em `http://localhost` e a documentação em `http://localhost/api-docs`.

## 4. Detalhamento Técnico da Infraestrutura

### Otimização de Imagens
O `Dockerfile` da aplicação utiliza **Multi-stage build** com a imagem leve `node:26-alpine`:
- **Stage 1 (`builder`):** instala todas as dependências e compila o TypeScript (`npm run build`)
- **Stage 2 (`runner`):** copia apenas `dist/`, `node_modules/` e `server.js` — descartando os arquivos de desenvolvimento e reduzindo significativamente o tamanho final da imagem

### Persistência
Os dados do PostgreSQL são persistidos em um **Named Volume** gerenciado pelo Docker:
- Volume: `postgres-data` → montado em `/var/lib/postgresql/data` dentro do container `postgres`
- Os dados sobrevivem a reinicializações dos containers (`docker compose restart`) e só são apagados com `docker compose down -v`

### Rede e Comunicação
Todos os serviços compartilham a rede bridge customizada `private-network`, que fornece **DNS interno** automático:
- O Nginx recebe requisições externas na porta `80` e as encaminha internamente para `http://node:3000`
- O serviço `node` acessa o banco via `DB_HOST=postgres` (nome do serviço como hostname)
- O pgAdmin acessa o banco via hostname `postgres` na porta `5432`
- Nenhum serviço de banco ou aplicação expõe portas diretamente ao host, exceto ao Nginx (`80`)

### Segurança
- Todas as credenciais são carregadas via arquivo `.env` (nunca hardcoded) e ignoradas pelo `.gitignore`
- O arquivo `pgadmin/pgpass` (com senha do banco) também está protegido pelo `.gitignore`
- A rede `private-network` isola os serviços internos, impedindo acesso externo direto ao banco de dados

## 5. Gestão de Segredos e Configurações

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

4. **Sincronize o arquivo `pgadmin/pgpass`** com as credenciais que você definiu no `.env`. Abra o arquivo e atualize os campos de usuário e senha para que correspondam a `DB_USERNAME` e `DB_PASSWORD`:

   ```
   # pgadmin/pgpass  ← este arquivo NÃO deve ser commitado (já está no .gitignore)
   # Formato: hostname:port:database:username:password
   postgres:5432:*:seu_usuario:sua_senha_segura
   ```

   > [!WARNING]
   > Se os valores em `pgadmin/pgpass` não baterem com as credenciais do banco, o pgAdmin abrirá o servidor pré-configurado mas **solicitará a senha manualmente** na primeira conexão.

#### Descrição das variáveis

| Variável | Descrição | Exemplo |
|---|---|---|
| `DB_HOST` | Host do banco de dados (nome do serviço Docker) | `postgres` |
| `DB_PORT` | Porta do PostgreSQL | `5432` |
| `DB_DATABASE` | Nome do banco de dados a ser criado/utilizado | `vendas_db` |
| `DB_USERNAME` | Usuário do PostgreSQL | `admin` |
| `DB_PASSWORD` | Senha do usuário do PostgreSQL | `s3nh@F0rte!` |

> **Como as variáveis são usadas:** o `docker-compose.yml` repassa `DB_PASSWORD`, `DB_USERNAME` e `DB_DATABASE` diretamente ao container `postgres` via `POSTGRES_PASSWORD`, `POSTGRES_USER` e `POSTGRES_DB`. O serviço `node` recebe o arquivo `.env` completo via `env_file`, tornando todas as variáveis disponíveis para a aplicação NestJS.

## 6. Evidências de Funcionamento e Verificação

### 6.1 Verificar containers em execução

Confirme que todos os 4 serviços (`postgres`, `node`, `nginx`, `pgadmin`) estão com status **Up**:

```bash
docker compose ps
```

Saída esperada:

```
NAME                      STATUS          PORTS
prova_segundo_bimestre-nginx-1      Up      0.0.0.0:80->80/tcp
prova_segundo_bimestre-node-1       Up
prova_segundo_bimestre-pgadmin-1    Up      0.0.0.0:8090->80/tcp
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
| PgAdmin | `http://localhost:8090` | Interface de administração do banco |

## 7. Troubleshooting e Limpeza

### Problemas comuns

| Sintoma | Causa provável | Solução |
|---|---|---|
| Container `node` reinicia em loop | Banco ainda não está pronto | Aguarde o `postgres` subir; o `depends_on` garante a ordem mas não a prontidão |
| `Error: password authentication failed` | Credenciais no `.env` não batem com o volume existente | Rode `docker compose down -v` para apagar o volume e suba novamente |
| Nginx retorna 502 Bad Gateway | Serviço `node` ainda está inicializando | Aguarde alguns segundos e recarregue |
| pgAdmin pede senha na conexão | `pgadmin/pgpass` não está sincronizado com o `.env` | Corrija o `pgpass` e rode `docker compose restart pgadmin` |
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
```


---

# Desenvolvimento Web
* **Descrição do sistema de APIs**
* **Entidades, tabelas e relacionamentos**
* **Indicação da tabela pivô e da relação N:N**
* **CRUD completo das entidades principais**
* **Containers utilizados no projeto**

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

## Rota da documentação Swagger

A documentação interativa da API está disponível em:

```
http://localhost/api-docs
```

Gerada automaticamente pelo `@nestjs/swagger` a partir das anotações nos controllers. Permite testar todas as rotas diretamente pelo navegador.

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

### Criar uma nova migration

```bash
npm run migration:generate
```