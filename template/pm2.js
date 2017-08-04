var shell = require('shelljs');
shell.exec(
    `ts-node -F ${process.cwd()}/app.ts`
);