# Implantação de Servidores
## 1. Identificação do Projeto
* **Título**: Sistema de Vendas
* **Descrição**: Aplicação de vendas para ajudar no gerenciamento e melhor organização dos lucros.
* **Caminho Escolhido**: Opção A (Docker/Orquestração Local)

## 2. Pré-requisitos
* **Lista de ferramentas necessárias instaladas no ambiente WSL2**: Docker Desktop
* **Configurações iniciais necessárias**: Inicializar o Docker na máquina host

## 3. Guia de Instalação e Execução ("How to Up")
### Instruções passo a passo de como subir a infraestrutura completa.

-- Definir os comandos aqui
* Para Docker (Opção A): Comandos para build e execução (ex: docker-compose
up -d --build).

## 4. Detalhamento Técnico da Infraestrutura
* Otimização de Imagens: Breve explicação de como o Dockerfile foi otimizado (uso
de imagens leves como Alpine/Slim e técnica de Multi-stage build).
* Persistência: Descrição da estratégia de dados usada (Named Volumes no Docker
ou Amazon RDS/S3 na AWS).
* Rede e Comunicação: Explicação de como os serviços se comunicam (uso de rede
bridge customizada com DNS Interno no Docker ou estrutura de VPC com subnets
na AWS).
* Segurança: Descrição das medidas aplicadas (variáveis de ambiente no arquivo
.env, Roles do IAM ou Security Groups restritivos).

## 5. Gestão de Segredos e Configurações
* Instruções de como o avaliador deve configurar as variáveis de ambiente (ex:
arquivo .env.example). Aviso: Reforce que nunca devem comitar senhas ou
chaves reais no repositório.

## 6. Evidências de Funcionamento e Verificação
* Lista de comandos que o avaliador pode usar para validar o sistema (ex: docker
ps, docker-compose logs, aws sts get-caller-identity).

* URL ou endereço IP de acesso à aplicação funcionando.

## 7. Troubleshooting e Limpeza
* Como diagnosticar problemas comuns e o comando para destruir e limpar os
recursos após a avaliação para evitar custos desnecessários (ex: docker-compose
down -v ou comandos de remoção na AWS).

# Banco de Dados
## 1. Definição da Arquitetura
### 1.1 Escolha Tecnológica
* **Tipo de banco escolhido (SQL ou NoSQL)**: SQL
* **Provedor utilizado (PostgreSQL, MySQL, SQL Server, MongoDB, Redis, DynamoDB, etc.)**: PostgreSQL
* **Justificativa técnica da escolha**: PostgreSQL foi escolhido por ser um banco relacional robusto com total conformidade ACID, ideal para dados estruturados com relacionamentos bem definidos. Além do modelo relacional tradicional, oferece suporte nativo a JSON, o que adiciona flexibilidade sem abrir mão da consistência. É open-source, amplamente adotado em produção e conta com ecossistema maduro de ferramentas e integrações.
### 1.2 Requisitos do Sistema
Descrever:
* **Objetivo do sistema**: Facilitar o gerenciamento financeiro do comércio;
* Principais entidades ou documentos.
* Volume estimado de dados.
* Quantidade estimada de usuários.
* Principais consultas realizadas.