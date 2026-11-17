# Modules

Each folder here is a **deep module**: a lot of behaviour behind a small
interface. Its interface is its **entry points**, the files at the module's
root. Everything in a subfolder is private.

```
app/modules/
  <name>/
    index.ts          ← an entry point. Import this from outside.
    index.server.ts   ← another entry point (server-only). A module may expose several.
    lib/              ← implementation: hidden from outside, free to import each other.
    tests/            ← tests and fixtures: reach the module through its entry points.
```

Copy `example/` to start a new module. `instructor-analytics/` is a real one:
its `index.server.ts` reads from the app's database, so routes never touch
`db` to get analytics.

**Expose several small entry points, not a barrel.** Do not write an
`index.ts` that re-exports a whole subtree. Add a root file per audience
(`index.ts`, `client.ts`, `index.server.ts`) and keep implementation in
`lib/`.

## Rules

Run `npm run lint:boundaries` (dependency-cruiser, config in
`.dependency-cruiser.cjs`). Every rule is an error.

**Entry-point boundary.** Code outside a module (routes, `app/lib`, other
modules) imports only the module's root files, never anything in its
subfolders.

**Intra-package freedom.** A module's own files import each other freely.

**Tests through the entry points.** Files under `<name>/tests/` may import
any module's entry points and their own `tests/` fixtures, never any
module's `lib/`, not even their own.

**No cycles.** No dependency cycles anywhere under `app/`.

Modules are flat: one level under `app/modules/`. A module's internals may
nest as deep as you like, but a module never contains another module.
