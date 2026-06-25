const { execSync } = require('child_process');
const path = require('path');

const migrateCommand = () => {
    console.log('▶  Executando migrations...');
    execSync(
        'npx typeorm-ts-node-commonjs migration:run -d data-source.ts',
        { stdio: 'inherit' },
    );
    console.log('✔  Migrations executadas com sucesso.');
};

module.exports = { migrateCommand };