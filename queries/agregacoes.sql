-- 3. Total arrecadado e ticket médio por mês (Agregação)
-- Motivo: Crucial para análise financeira do negócio, permitindo acompanhar metas de faturamento mensal e média gasta por venda.
SELECT 
    DATE_TRUNC('month', v.data_venda) AS mes,
    COUNT(DISTINCT v.id) AS total_vendas,
    SUM(iv.quantia * iv.valor) AS receita_total,
    SUM(iv.quantia * iv.valor) / COUNT(DISTINCT v.id) AS ticket_medio
FROM tb_vendas v
JOIN tb_itens_vendas iv ON v.id = iv.venda_id
GROUP BY DATE_TRUNC('month', v.data_venda)
ORDER BY mes DESC;

-- 4. Ranking dos produtos mais vendidos (Agregação e Ordenação)
-- Motivo: Auxilia fortemente na gestão de estoque e ações de marketing, identificando rapidamente os itens de maior saída (Top 10).
SELECT 
    i.codigo,
    i.nome,
    SUM(iv.quantia) AS total_vendido
FROM tb_itens_vendas iv
JOIN tb_itens i ON iv.item_id = i.codigo
GROUP BY i.codigo, i.nome
ORDER BY total_vendido DESC
LIMIT 10;

-- 5. Faturamento total gerado por cada vendedor (Agregação com JOIN)
-- Motivo: Permite calcular comissões de funcionários e identificar os melhores vendedores, baseados em performance de vendas.
SELECT 
    u.id,
    u.nome,
    u.sobrenome,
    SUM(iv.quantia * iv.valor) AS total_arrecadado_pelo_vendedor
FROM tb_usuarios u
JOIN tb_vendas v ON v.usuario_id = u.id
JOIN tb_itens_vendas iv ON v.venda_id = v.id
GROUP BY u.id, u.nome, u.sobrenome
ORDER BY total_arrecadado_pelo_vendedor DESC;
