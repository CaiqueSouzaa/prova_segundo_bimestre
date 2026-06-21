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

const { migrateCommand } = require('./commands/migrate.command');
const { migrationGenerateCommand } = require('./commands/migration-generate.command');

const [, , command, ...args] = process.argv;

const commands = {
  migrate: migrateCommand,
  "migration:generate": migrationGenerateCommand
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
