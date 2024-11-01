import generate from './src/generate';
import { exec } from 'child_process';
import fs from 'fs';

const TMP_BUNDLE_NAME = '_temp-bundled-input.yml';

function cleanup() {
  console.log('Running cleanup');
  fs.unlink(`./${TMP_BUNDLE_NAME}`, (err) => {
    if (err) {
      throw err;
    } else {
      console.log('Cleanup successful');
    }
  });
}

// TODO: clarify and handle errors around input parameters

const bundleStep = exec(`npx @redocly/cli bundle ${Bun.argv[2]} --output ./${TMP_BUNDLE_NAME}`);
bundleStep.on('exit', (code: number, signal) => {
  if (code === 0) {
    console.log(`Successfully bundled input spec into ./${TMP_BUNDLE_NAME}`);
    generate(TMP_BUNDLE_NAME, Bun.argv[3], cleanup);
  } else {
    console.error(`Bundling with \`redocly bundle\` failed. Check that path $refs to files are valid and try again.\nSignal: ${signal}`);
  }
});
