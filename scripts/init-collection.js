const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

// Caminho para o arquivo .env
const envPath = path.join(__dirname, '../.env');

// Função simples para carregar as variáveis do .env
const loadEnv = () => {
  const envConfig = {};
  try {
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
      // Ignorar comentários e linhas vazias
      if (line.trim().startsWith('#') || line.trim() === '') return;
      
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        envConfig[match[1]] = match[2];
      }
    });
    return envConfig;
  } catch (error) {
    console.error('Erro ao ler o arquivo .env:', error.message);
    process.exit(1);
  }
};

const env = loadEnv();

// Configuração de conexão usando as variáveis do .env
const client = new Client({
  host: env.DB_HOST,
  port: parseInt(env.DB_PORT, 10),
  database: env.DB_DATABASE,
  user: env.DB_USERNAME,
  password: env.DB_PASSWORD,
});

async function runSetup() {
  try {
    await client.connect();
    console.log('Conectado ao banco de dados com sucesso.');

    // Caminho para o arquivo setup.sql
    const sqlPath = path.join(__dirname, 'setup.sql');
    const sqlQuery = fs.readFileSync(sqlPath, 'utf8');

    console.log('Executando o script setup.sql...');
    
    // Executando a query setup
    await client.query(sqlQuery);
    
    console.log('O arquivo setup.sql foi implementado no banco de dados com sucesso!');

    // Caminho para o arquivo seed.sql
    const seedPath = path.join(__dirname, 'seed/seed.sql');
    const seedQuery = fs.readFileSync(seedPath, 'utf8');

    console.log('Executando o script seed.sql...');

    // Executando a query seed
    await client.query(seedQuery);

    console.log('O arquivo seed.sql foi implementado no banco de dados com sucesso!');
  } catch (error) {
    console.error('Erro ao executar o setup.sql:', error);
  } finally {
    await client.end();
    console.log('Conexão com o banco de dados encerrada.');
  }
}

runSetup();
