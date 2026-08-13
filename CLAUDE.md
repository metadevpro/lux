# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Lux is an Angular library providing UI components published as `@metadev/lux` on npm. The repository contains:

- **Library source**: `projects/lux/` - The actual Lux library components
- **Demo application**: `src/` - Angular application showcasing library components with sample pages

## Architecture

### Dual Project Structure

This is an Angular workspace with two projects defined in `angular.json`:

1. **lux** (library) - The publishable Angular library at `projects/lux/`
2. **lux-demo** (application) - The demo app that consumes and demonstrates the library

The demo app references the library through TypeScript path mappings (`tsconfig.json`) pointing to `dist/lux/`.

### Component Organization

Each component in `projects/lux/src/lib/` follows a consistent structure:

- Component folder named after the feature (e.g., `autocomplete/`, `checkbox/`, `modal/`)
- Contains: component TypeScript, template, styles, spec files, and supporting files
- All public exports defined in `projects/lux/src/public-api.ts`

The library uses **standalone components** imported and re-exported through `LuxModule` (at `projects/lux/src/lib/lux.module.ts`), providing both standalone and module-based consumption patterns. `LuxModule`'s `declarations` array is empty by design — every component/directive is standalone, so the module only `imports` them and re-`exports` them for consumers who prefer the NgModule style. All public exports (components, directives, services, and supporting types like `DataSource`) are declared in `projects/lux/src/public-api.ts`; add new symbols there when creating a component, or consumers won't be able to import them.

### Key Components

- **Form Controls**: Autocomplete, Checkbox, DatetimeComponent, InputComponent, RadiogroupComponent, SelectComponent, FilterComponent
- **Navigation**: BreadcrumbComponent, PaginationComponent
- **Overlays**: Modal (service-based with ModalService, ModalRef), Tooltip (directive-based with LuxTooltipDirective)
- **Advanced**: GeolocationComponent, MapComponent (uses OpenLayers), VoiceRecognitionDirective
- **Utilities**: DataSource interfaces, helper functions in `helperFns.ts`, WindowService

Modal and Tooltip use service-based architecture with dynamic component creation managed through backdrop and window components.

## Development Commands

### Build Commands

```bash
npm run build:lux              # Build library only (outputs to dist/lux/)
npm run build                  # Build demo app (production)
npm run build-start            # Build library then serve demo app
```

### Test Commands

```bash
npm test                       # Run all tests with Jest
npm run test:watch             # Run tests in watch mode
npm run test:coverage          # Run tests with coverage for lux library
```

### Lint Commands

```bash
npm run lint                   # Lint demo app
npm run lint:lux               # Lint library (use this for library changes)
```

### Development Server

```bash
npm start                      # Serve demo app at http://localhost:4200
ng serve                       # Alternative command for dev server
```

### CI/Publishing

```bash
npm run ci                     # Run lint, tests, and build (CI pipeline)
npm run npm-publish            # Full CI + publish to npm
```

### Documentation

```bash
npm run compodoc               # Generate component documentation
```

## Testing

Uses **Jest** (not Karma) with `jest-preset-angular` and `@ngneat/spectator` for component testing. Configuration in `jest.config.js` (root) with setup in `setup-jest.ts`. `npm test` runs Jest directly (not through `ng test`), so it covers both `projects/lux` and `src/` in one pass.

Test files use `.spec.ts` extension and are colocated with components. The standard pattern uses Spectator's `createComponentFactory`/`Spectator<T>` rather than raw TestBed:

```ts
const createComponent = createComponentFactory({ component: CheckboxComponent });
spectator = createComponent();
```

To run a single test file: `npx jest path/to/component.spec.ts`. To run tests matching a name: `npx jest -t "test name"`.

## Local Library Development

To test library changes in a consuming application:

1. Build the library: `npm run build:lux`
2. Navigate to output: `cd dist/lux`
3. Create tarball: `npm pack`
4. Install in target app: `npm install /path/to/lux/dist/lux/metadev-lux-<version>.tgz`

## Lint Conventions (eslint.config.js)

A few non-default rules matter when adding code:

- Single quotes, explicit function return types are required (`@typescript-eslint/explicit-function-return-type`).
- `max-len` is 180, not the ESLint default.
- Component selectors: element, kebab-case, **no prefix** (e.g. `checkbox`, not `lux-checkbox`). Directive selectors: attribute, camelCase, no prefix.
- `no-explicit-any`, `no-unused-vars`, and `no-empty-function` are turned off.

## Git Workflow

- Main development branch: `devel`
- Create pull requests targeting `devel`, not `main`/`master`

## Angular Version

Currently on Angular 22.x. When updating Angular:

- Run migrations in both demo app and library project
- Test library build and demo app thoroughly
- Update peer dependencies in `projects/lux/package.json` if needed
