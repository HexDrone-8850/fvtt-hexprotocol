# Contributing

## Getting started

1. Begin by installing Node.
   - It's recommended to install through the Node Version Manager, [`nvm`](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating).
   - Run `nvm install node` to install the newest version. The latest verified version to work is `v22.9.0`, you can install with `nvm install 22.9.0`.
2. Run `corepack enable`. Corepack is the modern solution to installation for package managers. This enables `yarn` as well as `pnpm` etc.
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
7. Visit `localhost:3001` to see your project during development. You'll get automatic hot reload whenever you save your files.

When you're ready to ship your project, run `yarn run build` to get an optimized build!
