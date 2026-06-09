/**
 * Entrypoint de Comandos CLI Node.js
 *
 * Executa comandos administrativos da aplicação.
 *
 * Comandos disponíveis:
 *   node command.js migrate       — Executa todas as migrations pendentes
 *
 * Uso:
 *   node command.js <comando>
 */

const { execSync } = require('child_process');

const [, , command, ...args] = process.argv;

const commands = {
  migrate: () => {
    console.log('▶  Executando migrations...');
    execSync(
      'npx typeorm-ts-node-commonjs migration:run -d src/data-source.ts',
      { stdio: 'inherit' },
    );
    console.log('✔  Migrations executadas com sucesso.');
  },
};

if (!command) {
  console.error('Erro: nenhum comando informado.');
  console.error('Comandos disponíveis: ' + Object.keys(commands).join(', '));
  process.exit(1);
}

if (!commands[command]) {
  console.error(`Erro: comando desconhecido "${command}".`);
  console.error('Comandos disponíveis: ' + Object.keys(commands).join(', '));
  process.exit(1);
}

commands[command](args);
