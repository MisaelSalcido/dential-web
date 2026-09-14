import type { Options } from '@wdio/types';
import http from 'node:http';

const BASE_URL = 'http://localhost:4200';
const HEADLESS = process.env['E2E_HEADLESS'] !== 'false';
// Only set when a developer/CI machine needs to point at a specific Chrome binary instead of
// relying on WDIO's own local-Chrome auto-detection (research.md §1).
const CHROME_BINARY = process.env['CHROME_BIN'];

function checkAppIsReachable(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = http.get(url, (response) => {
      response.resume();
      resolve();
    });
    request.on('error', () => {
      reject(
        new Error(`dential-web is not reachable at ${url} — is 'npm start' running?`),
      );
    });
  });
}

export const config: Options.Testrunner = {
  runner: 'local',
  baseUrl: BASE_URL,
  specs: ['./specs/**/*.e2e.ts'],
  maxInstances: 1,
  capabilities: [
    {
      browserName: 'chrome',
      'goog:chromeOptions': {
        ...(CHROME_BINARY ? { binary: CHROME_BINARY } : {}),
        args: [
          '--disable-dev-shm-usage',
          ...(HEADLESS ? ['--headless=new', '--disable-gpu', '--no-sandbox', '--window-size=1280,800'] : []),
        ],
      },
    },
  ],
  logLevel: 'warn',
  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000,
  },
  autoCompileOpts: {
    autoCompile: true,
  },
  onPrepare: async function () {
    try {
      await checkAppIsReachable(BASE_URL);
    } catch (error) {
      // WDIO logs an onPrepare rejection but still proceeds to spawn workers, which would just
      // repeat this same failure as a confusing ERR_CONNECTION_REFUSED per scenario — exit hard
      // instead so the one clear, actionable message is the only thing printed (research.md §3).
      console.error((error as Error).message);
      process.exit(1);
    }
  },
  afterTest: async function (test, context, result) {
    if (!result.passed) {
      await browser.saveScreenshot(`/tmp/wdio-failure-${Date.now()}.png`);
    }
  },
  afterHook: async function (test, context, result) {
    if (result && !result.passed) {
      await browser.saveScreenshot(`/tmp/wdio-failure-hook-${Date.now()}.png`);
    }
  },
};
