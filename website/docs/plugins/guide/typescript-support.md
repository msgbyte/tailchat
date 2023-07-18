---
sidebar_position: 2
title: Typescript Support
---

In `Tailchat`, there are some utility functions or components shared from the core project, which you can import via `@capital/common` or `@capital/component`.

Of course, there are some type issues if quoted directly. Because at this time, the type system of typescript does not know what can be introduced and what types there are.

There may be two situations here:

## Develop in the Tailchat ontology project

You can import files in the same directory through the `paths` field of `tsconfig.json`, so that typescript can directly load the complete type system when parsing

for example:

```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "esModuleInterop": true,
    "jsx": "react",
    "paths": {
      "@capital/*": ["../../../src/plugin/*"],
    }
  }
}
```

## Develop in a standalone project

You can develop by getting Tailchat's pre-generated declaration files.

> Because the type needs to be manually rewritten then some types are still any. But it can guarantee that developers will not introduce functions that do not exist

If you are using the `tailchat create` command to create the project, the command line tool template has added the following commands for you

```json
"scripts": {
  "sync:declaration": "tailchat declaration github"
},
```

usage

```bash
pnpm sync: declaration
```

This command will automatically pull the remote configuration file and write it into the `types/tailchat.d.ts` file in the current directory. If you manually created the project, you can add it to your `package.json` for subsequent use
