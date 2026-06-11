-- DDL - Script de criação das tabelas, constraints e índices

CREATE TABLE tb_clientes (
    id SERIAL PRIMARY KEY,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    nome VARCHAR(100) NOT NULL,
    sobrenome VARCHAR(100) NOT NULL
);

CREATE TABLE tb_usuarios (
    id SERIAL PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    nome VARCHAR(100) NOT NULL,
    sobrenome VARCHAR(100) NOT NULL
);

CREATE TABLE tb_itens (
    codigo VARCHAR(50) PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    quantia DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    valor DECIMAL(10, 2) NOT NULL DEFAULT 0.00
);

CREATE TABLE tb_vendas (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER REFERENCES tb_clientes(id) ON DELETE SET NULL ON UPDATE SET NULL,
    usuario_id INTEGER REFERENCES tb_usuarios(id) ON DELETE SET NULL ON UPDATE SET NULL,
    data_venda TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tb_itens_vendas (
    id SERIAL PRIMARY KEY,
    venda_id INTEGER REFERENCES tb_vendas(id) ON DELETE CASCADE ON UPDATE CASCADE,
    item_id VARCHAR(50) REFERENCES tb_itens(codigo) ON DELETE CASCADE ON UPDATE CASCADE,
    quantia DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    valor DECIMAL(10, 2) NOT NULL DEFAULT 0.00
);

-- Criação dos Índices de Performance
CREATE INDEX idx_tb_vendas_data_venda ON tb_vendas(data_venda);
CREATE INDEX idx_tb_vendas_cliente_id ON tb_vendas(cliente_id);
CREATE INDEX idx_tb_itens_vendas_venda_id ON tb_itens_vendas(venda_id);
