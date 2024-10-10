import inquirer from 'inquirer';
import generate from './src/generate';
import { exec } from 'child_process';

const bundleStep = exec(`npx redocly bundle ${Bun.argv[2]} --output ./bundled-input.yml`);
bundleStep.on('exit', (code: number, signal) => {
  if (code === 0) {
    console.log('Successfully bundled input spec into ./bundled-input.yml');
    generate('./bundled-input.yml', Bun.argv[3], inquirer.prompt);
  } else {
    console.error(`Unable to bundle input spec. Exit code: ${code}. Signal: ${signal}`);
  }
});
