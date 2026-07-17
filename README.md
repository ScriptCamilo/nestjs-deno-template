<p align="center">
  <a href="https://nestjs.com/" target="_blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="NestJS logo" />
  </a>
</p>

<h1 align="center">NestJS + Deno Template</h1>

<p align="center">
  A Deno-first starter for building efficient and scalable server-side applications with NestJS.
</p>

## Description

This repository is a minimal [NestJS](https://nestjs.com/) template designed to
run, test, and manage dependencies with [Deno](https://deno.com/) instead of the
traditional Node.js package-manager workflow.

The project keeps the familiar NestJS architecture—modules, controllers,
providers, decorators, and the Nest CLI—while using:

- `deno.json` as the main project and dependency configuration;
- `deno.lock` for reproducible dependency resolution;
- Deno tasks instead of `npm` scripts;
- Deno's native TypeScript execution, test runner, formatter, and linter;
- Deno's npm compatibility layer for NestJS packages and tooling;
- an import map with the `@/` alias pointing to `src/`.

## Requirements

- [Deno 2](https://docs.deno.com/runtime/getting_started/installation/)

Node.js and a global Nest CLI installation are not required. The Nest CLI is
declared as an npm dependency in `deno.json` and is resolved by Deno when a task
uses it.

## Project setup

Clone the repository and install/cache its dependencies:

```bash
deno install
```

You can also start the development task directly. With `nodeModulesDir: "auto"`,
Deno creates and manages the local `node_modules` directory when npm packages
are needed.

## Tasks

Run `deno task` to list every task available in `deno.json`.

| Task         | Command                | Purpose                                                                                               |
| ------------ | ---------------------- | ----------------------------------------------------------------------------------------------------- |
| `dev`        | `deno task dev`        | Starts the application from `src/main.ts` and restarts it when source files change.                   |
| `build`      | `deno task build`      | Runs the Nest CLI compiler and writes the production output to `dist/`.                               |
| `start:prod` | `deno task start:prod` | Runs the compiled application from `dist/main.js`. Build the project first.                           |
| `generate`   | `deno task generate`   | Opens the interactive Nest schematic generator. Additional arguments can select a schematic directly. |
| `check`      | `deno task check`      | Type-checks the application entry point and its dependency graph.                                     |
| `lint`       | `deno task lint`       | Checks the code with Deno's built-in linter.                                                          |
| `fmt`        | `deno task fmt`        | Formats the project with Deno's built-in formatter.                                                   |
| `fmt:check`  | `deno task fmt:check`  | Verifies formatting without changing files.                                                           |
| `test`       | `deno task test`       | Runs the unit tests under `src/`.                                                                     |
| `test:e2e`   | `deno task test:e2e`   | Runs the end-to-end tests under `test/`.                                                              |
| `test:all`   | `deno task test:all`   | Runs the complete unit and end-to-end test suite.                                                     |
| `ci`         | `deno task ci`         | Runs type checking, formatting, linting, all tests, and the production build.                         |

### Development

```bash
deno task dev
```

The development task grants only the permissions currently required by the
application:

- `--allow-net` allows the HTTP server to listen for connections;
- `--allow-env` allows Nest to read values such as `PORT`;
- `--watch` restarts the process after source changes.

By default, the API is available at <http://localhost:3000>. Set `PORT` to use a
different port.

### Generate NestJS resources

Start the interactive generator:

```bash
deno task generate
```

Or pass a schematic and name directly:

```bash
deno task generate module users
deno task generate controller users
deno task generate service users
```

Generated files follow the configuration in `nest-cli.json`, whose source root
is `src/`.

### Build and run in production mode

```bash
deno task build
deno task start:prod
```

The build uses `tsconfig.build.json`, excludes test files, clears the previous
output through the Nest CLI configuration, and emits the application into
`dist/`.

The production task currently uses `-A`, which grants the compiled application
all Deno permissions. For a deployed application, consider replacing it with the
smallest set of explicit permissions required by your infrastructure.

## Testing

This template uses Deno's native test runner together with `@std/testing`,
`@std/expect`, Nest's testing utilities, and Supertest.

```bash
# Run unit tests
deno task test

# Run end-to-end tests
deno task test:e2e

# Run the complete test suite
deno task test:all
```

Test files use the `*.test.ts` convention. Unit tests live alongside the source
files, while end-to-end tests live in `test/`. The Supertest suite receives
`--allow-env`, `--allow-sys`, and `--allow-net` so Nest can inspect the runtime
environment and the HTTP test server can use a local listener.

## Code quality

The project relies on Deno's built-in tools, so no separate ESLint or Prettier
installation is necessary:

```bash
# Type-check the application entry point and its dependency graph
deno task check

# Check lint rules
deno task lint

# Check formatting without changing files
deno task fmt:check

# Format the project
deno task fmt

# Run every CI validation locally
deno task ci
```

## Import aliases and dependencies

Dependencies are declared in the `imports` section of `deno.json`. NestJS
packages use `npm:` specifiers, while Deno standard-library packages use `jsr:`
specifiers.

The `@/` alias maps to the `src/` directory:

```ts
import { AppModule } from "@/app.module";
```

The same alias is configured under `compilerOptions.paths` in
`tsconfig.build.json` so both Deno and the Nest build can resolve it.

## Project structure

```text
.
├── src/
│   ├── app.controller.test.ts  # Unit test
│   ├── app.controller.ts       # HTTP controller
│   ├── app.module.ts           # Root Nest module
│   ├── app.service.ts          # Application provider
│   └── main.ts                 # Application entry point
├── test/
│   └── app.test.ts             # End-to-end test
├── .github/workflows/
│   └── ci.yml                  # GitHub Actions validation workflow
├── deno.json                   # Tasks, imports, compiler and Deno settings
├── deno.lock                   # Dependency lockfile
├── LICENSE                     # MIT license
├── nest-cli.json               # Nest CLI configuration
└── tsconfig.build.json         # Production build configuration
```

## Deno-first considerations

- Prefer `deno task`, `deno test`, `deno lint`, and `deno fmt` for project
  workflows.
- Add dependencies to the `imports` map with `deno add` rather than managing
  them with npm.
- Keep runtime permissions explicit and scoped whenever possible.
- Some NestJS ecosystem packages may depend on Node-specific APIs. Deno's Node
  and npm compatibility layers cover many packages, but compatibility should be
  verified when adding new integrations.

## Deployment

Build the project in CI and run the generated entry point with Deno. A minimal
deployment pipeline should:

1. install dependencies using the committed `deno.lock`;
2. run type checks, linting, formatting checks, and tests;
3. execute `deno task build`;
4. start the application with the permissions required by the target platform.

The included GitHub Actions workflow runs `deno ci` and `deno task ci` for
pushes and pull requests targeting the `main` and `staging` branches.
Dependencies are installed from the committed lockfile and cached between
workflow runs.

See the [NestJS deployment documentation](https://docs.nestjs.com/deployment)
for framework-level production guidance and the
[Deno runtime documentation](https://docs.deno.com/runtime/) for runtime and
permission configuration.

## Resources

- [NestJS documentation](https://docs.nestjs.com/)
- [NestJS Discord](https://discord.gg/G7Qnnhy)
- [Deno documentation](https://docs.deno.com/)
- [Deno tasks](https://docs.deno.com/runtime/reference/cli/task/)
- [Deno permissions](https://docs.deno.com/runtime/fundamentals/security/)

## License

This template is available under the [MIT License](LICENSE). NestJS is also
[MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
