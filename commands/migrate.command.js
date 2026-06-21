const { execSync } = require('child_process');

const migrateCommand = () => {
    console.log('▶  Executando migrations...');
    execSync(
        'npx typeorm-ts-node-commonjs migration:run -d src/data-source.ts',
        { stdio: 'inherit' },
    );
    console.log('✔  Migrations executadas com sucesso.');
};

module.exports = { migrateCommand };