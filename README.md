# DentialWeb

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.1.6.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## End-to-end tests

The `e2e/` directory holds a [WebdriverIO](https://webdriver.io/) suite that drives the app in a
real (headless by default) Chrome browser, covering new patient creation and starting a Historia
Clínica — success and expected-error paths — for each of the three demo account tiers (free,
paid, clinic).

**Prerequisites** (the suite doesn't start these itself):

- Postgres running: `docker compose -f ../dential-api/docker-compose.yml up -d`
- The API running with demo accounts seeded: `DENTIAL_SEED_DEMO_ACCOUNTS=true ./gradlew bootRun`
  (from `dential-api/`) — see `dential-api/.env.example` for the demo account env vars
- This app running: `npm start`
- Google Chrome installed locally (WebdriverIO manages a matching driver automatically)

Then, from `dential-web/`:

```bash
npm run e2e
```

This runs all scenarios and prints a per-scenario pass/fail line naming the tier and case (e.g.
`clinic tier: rejects patient creation missing a required field`), so a failure is attributable
to a specific tier/flow rather than just an aggregate result. Each run generates its own unique
patient data, so it's safe to run repeatedly without resetting the database.

**Debugging**: set `E2E_HEADLESS=false` to watch the suite run in a visible Chrome window instead
of headless.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
