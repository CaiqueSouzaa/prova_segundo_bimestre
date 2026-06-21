const { execSync } = require('child_process');

const migrationGenerateCommand = () => {
    console.log('▶  Gerando migration...');
    execSync(
        'npm run migration:generate',
        { stdio: 'inherit' },
    );
    console.log('✔  Migrations executadas com sucesso.');
};

module.exports = { migrationGenerateCommand };