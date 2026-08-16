# Update Upstream Action

Updates repository with upstream

## TypeScript

This project type-checks with TypeScript 7 (the native Go compiler). Because
TypeScript 7 ships without the JavaScript compiler API, and ESLint, Jest and
Rollup all need that API, the two compilers are installed side by side as
[documented by the TypeScript team][side-by-side]:

| Dependency           | Resolves to               | Used by                                                                     |
| -------------------- | ------------------------- | --------------------------------------------------------------------------- |
| `@typescript/native` | `typescript@7`            | `npm run typecheck` (and `tsc`)                                             |
| `typescript`         | `@typescript/typescript6` | typescript-eslint, ts-jest, `@rollup/plugin-typescript`, `tsserver`, `tsc6` |

Run `npm run typecheck` to type-check with TypeScript 7. The `typescript` alias
can be dropped once the toolchain supports the new API landing in TypeScript
7.1.

[side-by-side]:
  https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#running-side-by-side-with-typescript-6.0
