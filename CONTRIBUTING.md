# Contributing

## Getting started

1. Begin by installing Node. You can get it from the [Node.js website](https://nodejs.org/), from your OS's package manager, or a tool like [Node Version Manager](https://github.com/nvm-sh/nvm) (`nvm`).
2. Run `corepack enable`. This enables `yarn` as well as `pnpm` etc.
3. Download all dependencies with `yarn install`.
4. In your editor you should make sure you're using Yarn's versions of TypeScript. In VSCode both ESLint and Prettier both automatically recognize the version but you have to select the TypeScript version. You should be automatically prompted to do this when you install but if not, follow these steps to do that:
   1. Open any `.ts` file.
   2. Open the Command Palette, by default Ctrl+Shift+P will open it. Make sure not to delete the `>` character.
   3. Search for "TypeScript Use Workspace Version" in VSCode.
   4. Select "Use the Workspace's Version". If for some weird reason there are multiple, select the entry starting with `.yarn/sdks`.
5. Make sure Foundry is running on `localhost:30000`.  
   If you want to run Foundry somewhere else, set the `FOUNDRY_HOST_NAME` variable and the `FOUNDRY_PORT` variable if needed.  
   Note: This project should automatically handle developers using Windows Subsystem for Linux (WSL) with Foundry running on Windows.
6. Start development with `yarn run dev`.
   - The first time, you might need to run `yarn run build`, symlink the `dist` folder it generates into your Foundry modules directory (rename the link to `hexprotocol`), then restart Foundry.
   - You should only have to do the symlink part once unless you move your copy of the repo or clone it on a different machine or something.
8. Visit `localhost:3001` to see your project during development. You'll get automatic hot reload whenever you save your files.

When you're ready to ship your project, run `yarn run build` to get an optimized build!
