You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## Project

Dential Web is a multi-tenant clinical record management system for dental clinics. Core domains:

- Clinical records: historia clínica, notas de evolución, odontograma, consentimiento
- Appointment scheduling and treatment plans
- Document/image storage
- Patient identity validation (CURP/RENAPO)
- Clinical note signing
- Multi-tenant clinic management
- Subscription/billing feature-gating
- Audit logging and data retention

**Product language:** Spanish (UI/UX copy, user-facing strings). **Engineering language:** English (code, comments, docs, this file).

## Folder Structure

- `public`: Public assets
- `src/environments`: Environment files
- `src/app`
  - `components`: Individual components
  - `pages`: Navigation-routed components
  - `utils`: Util files
  - `models`: Models for objects
  - `services`
    - `api`: HTTP API specific services
    - `local`: App services (notifications, popups, auth, etc.)
  - `directives`: Custom Angular directives
  - `guards`: Angular guards
  - `decorators`: Custom Angular decorators
  - `pipes`: Custom Angular pipes

## Security

- Use Angular guards to guard user-specific routes
- Treat clinical and patient identity data (CURP/RENAPO, historia clínica, consentimiento) as sensitive; never log it
- Respect multi-tenant boundaries — never let client code assume a single tenant/clinic context
- Enforce subscription/billing feature-gating checks before rendering or enabling gated features
- Preserve audit logging hooks for actions that must be traceable (clinical note signing, record edits, deletions)

## Code Structure

- Always create components with files for HTML, CSS, TS, and spec testing, even if CSS is mostly unused
- For page components (components connected to a route), create the component under `src/app/pages` following the same route path as the Angular route (e.g., `/home` -> `src/app/pages/home`)
- Always prefer signals over observables/promises
- For promises, always use async/await; don't create callbacks
- For table queries or calls that fetch multiple objects with filters from the API, use `httpResource` with debounce to avoid flooding the API
- Always use Tailwind CSS classes rather than custom CSS
- Always design mobile-first
- If an HTML file is too big (500+ lines), break it into components
- Use async pipes in the HTML when using observables/promises
- Use `@if`/`@else`/`@for`/`@switch` instead of legacy star directives (`*ngIf`, etc.)
- Explicit RxJS cleanup (unsubscribe, `takeUntilDestroyed`, etc.)
- Always use `input()` and `output()` signals for components
- Always create unit tests for new functionality
- Feel free to ask if something is missing or unclear

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Do NOT set `changeDetection: ChangeDetectionStrategy.OnPush` explicitly. `OnPush` is the default in Angular v22+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `model()` for two-way bound properties with `[(prop)]` syntax instead of pairing `input()` with `output()`
- Use `computed()` for derived state
- Use `linkedSignal()` for state derived from multiple reactive sources that must stay synchronized
- Prefer inline templates for small components
- Prefer Signal Forms (`@angular/forms/signals`) for new forms. They are stable in Angular v22+ and provide signal-based state, type-safe field access, and schema-based validation
- When not using Signal Forms, prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Prefer the `@Service` decorator over `@Injectable({providedIn: 'root'})` for new singleton services (Angular v22+)
- Use the `inject()` function instead of constructor injection
