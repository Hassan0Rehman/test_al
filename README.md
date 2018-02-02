# Getting started
- Clone the repository
```
git clone --depth=1 'NEED UPDATE' <project_name>
```
- Install dependencies
```
cd <project_name>
npm install
```
- Build and run the project
```
npm start
```
Navigate to `http://localhost:3000`

### Configuring TypeScript compilation
TypeScript uses the file `tsconfig.json` to adjust project compile options.
Let's dissect this project's `tsconfig.json`, starting with the `compilerOptions` which details how your project is compiled. 

```json
    "compilerOptions": {
        "module": "commonjs",
        "target": "es6",
        "noImplicitAny": true,
        "moduleResolution": "node",
        "sourceMap": true,
        "outDir": "dist",
        "baseUrl": ".",
        "paths": {
            "*": [
                "node_modules/*",
                "src/types/*"
            ]
        }
    },
```

| `compilerOptions` | Description |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `"module": "commonjs"`             | The **output** module type (in your `.js` files). Node uses commonjs, so that is what we use           |
| `"target": "es6"`                  | The output language level. Node supports ES6, so we can target that here                               |
| `"noImplicitAny": true`            | Enables a stricter setting which throws errors when something has a default `any` value                |
| `"moduleResolution": "node"`       | TypeScript attempts to mimic Node's module resolution strategy. Read more [here](https://www.typescriptlang.org/docs/handbook/module-resolution.html#node)                                                                    |
| `"sourceMap": true`                | We want source maps to be output along side our JavaScript. See the [debugging](#debugging) section          |
| `"outDir": "dist"`                 | Location to output `.js` files after compilation                                                       |
| `"baseUrl": "."`                   | Part of configuring module resolution. See [path mapping section](#installing-dts-files-from-definitelytyped) |
| `paths: {...}`                     | Part of configuring module resolution. See [path mapping section](#installing-dts-files-from-definitelytyped) |



The rest of the file define the TypeScript project context.
The project context is basically a set of options that determine which files are compiled when the compiler is invoked with a specific `tsconfig.json`.
In this case, we use the following to define our project context: 
```json
    "include": [
        "src/**/*"
    ]
```
`include` takes an array of glob patterns of files to include in the compilation.
This project is fairly simple and all of our .ts files are under the `src` folder.
For more complex setups, you can include an `exclude` array of glob patterns that removes specific files from the set defined with `include`.
There is also a `files` option which takes an array of individual file names which overrides both `include` and `exclude`.


### Running the build
All the different build steps are orchestrated via [npm scripts](https://docs.npmjs.com/misc/scripts).
Npm scripts basically allow us to call (and chain) terminal commands via npm.
This is nice because most JavaScript tools have easy to use command line utilities allowing us to not need grunt or gulp to manage our builds.
If you open `package.json`, you will see a `scripts` section with all the different scripts you can call.
To call a script, simply run `npm run <script-name>` from the command line.
You'll notice that npm scripts can call each other which makes it easy to compose complex builds out of simple individual build scripts.
Below is a list of all the scripts this template has available:


| Npm Script | Description |
| ------------------------- | ------------------------------------------------------------------------------------------------- |
| `start`                   | Runs full build before starting all watch tasks. Can be invoked with `npm start`                  |
| `build`                   | Full build. Runs ALL build tasks (`build-sass`, `build-ts`, `tslint`, `copy-static-assets`)       |
| `serve`                   | Runs node on `dist/server.js` which is the apps entry point                                       |
| `watch`                   | Runs all watch tasks (TypeScript, Sass, Node). Use this if you're not touching static assets.     |
| `test`                    | Runs tests using Jest test runner                                                                 |
| `build-ts`                | Compiles all source `.ts` files to `.js` files in the `dist` folder                               |
| `watch-ts`                | Same as `build-ts` but continuously watches `.ts` files and re-compiles when needed                |
| `build-sass`              | Compiles all `.scss` files to `.css` files                                                        |
| `watch-sass`              | Same as `build-sass` but continuously watches `.scss` files and re-compiles when needed             |
| `tslint`                  | Runs TSLint on project files                                                                      |
| `copy-static-assets`      | Calls script that copies JS libs, fonts, and images to dist directory                             |

### Using the debugger in VS Code
Debugging is one of the places where VS Code really shines over other editors.
Node.js debugging in VS Code is easy to setup and even easier to use. 
This project comes pre-configured with everything you need to get started.

When you hit `F5` in VS Code, it looks for a top level `.vscode` folder with a `launch.json` file.
In this file, you can tell VS Code exactly what you want to do:

```json
{
    "type": "node",
    "request": "launch",
    "name": "Debug",
    "program": "${workspaceRoot}/dist/server.js",
    "smartStep": true,
    "outFiles": [
        "../dist/**/*.js"
    ],
    "protocol": "inspector"
}
```
This is mostly identical to the "Node.js: Launch Program" template with a couple minor changes:

| `launch.json` Options | Description |
| ----------------------------------------------- | --------------------------------------------------------------- |
| `"program": "${workspaceRoot}/dist/server.js",` | Modified to point to our entry point in `dist`                  |
| `"smartStep": true,`                            | Won't step into code that doesn't have a source map             |
| `"outFiles": [...]`                             | Specify where output files are dropped. Use with source maps    |
| `"protocol": inspector,`                        | Use the new Node debug protocol because we're on the latest node|

With this file in place, you can hit `F5` to serve the project with the debugger already attached.
Now just set your breakpoints and go!

> Warning! Make sure you don't have the project already running from another command line. 
VS Code will try to launch on the same port and error out.
Likewise be sure to stop the debugger before returning to your normal `npm start` process.

#### Using attach debug configuration
VS Code debuggers support attaching to an already running program. The `Attach` configuration has already configured, everything you need to do is change `Debug Configuration` to `Attach` and hit `F5`.

> Tips! Instead of running `npm start`, using `npm run debug` and `Attach Configuration` that make you don't need to stop running project to debug.

## Testing
For this project, I chose [Jest](https://facebook.github.io/jest/) as our test framework.
While Mocha is probably more common, Mocha seems to be looking for a new maintainer and setting up TypeScript testing in Jest is wicked simple.

### Install the components
To add TypeScript + Jest support, first install a few npm packages:
```
npm install -D jest ts-jest
```
`jest` is the testing framework itself, and `ts-jest` is just a simple function to make running TypeScript tests a little easier.

### Configure Jest
Jest's configuration lives in `package.json`, so let's open it up and add the following code:
```json
"jest": {
    "globals": {
      "__TS_CONFIG__": "tsconfig.json"
    },
    "moduleFileExtensions": [
      "ts",
      "js"
    ],
    "transform": {
      "^.+\\.(ts)$": "./node_modules/ts-jest/preprocessor.js"
    },
    "testMatch": [
      "**/test/**/*.test.(ts|js)"
    ],
    "testEnvironment": "node"
  },
```
Basically we are telling Jest that we want it to consume all files that match the pattern `"**/test/**/*.test.(ts|js)"` (all `.test.ts`/`.test.js` files in the `test` folder), but we want to preprocess the `.ts` files first. 
This preprocess step is very flexible, but in our case, we just want to compile our TypeScript to JavaScript using our `tsconfig.json`.
This all happens in memory when you run the tests, so there are no output `.js` test files for you to manage.   

### Running tests


### Writing tests
Writing tests for web apps has entire books dedicated to it and best practices are strongly influenced by personal style, so I'm deliberately avoiding discussing how or when to write tests in this guide.
However, if prescriptive guidance on testing is something that you're interested in, [let me know](https://www.surveymonkey.com/r/LN2CV82), I'll do some homework and get back to you.

### Running TSLint
Like the rest of our build steps, we use npm scripts to invoke TSLint.
To run TSLint you can call the main build script or just the TSLint task.
```
npm run build   // runs full build including TSLint
npm run tslint  // runs only TSLint
```
Notice that TSLint is not a part of the main watch task.
It can be annoying for TSLint to clutter the output window while in the middle of writing a function, so I elected to only run it only during the full build.
If you are interesting in seeing TSLint feedback as soon as possible, I strongly recommend the [TSLint extension in VS Code]().

# Dependencies
Dependencies are managed through `package.json`.
In that file you'll find two sections:
## `dependencies`

| Package                         | Description                                                           |
| ------------------------------- | --------------------------------------------------------------------- |
| async                           | Utility library that provides asynchronous control flow.              |
| bcrypt-nodejs                   | Library for hashing and salting user passwords.                       |
| body-parser                     | Express 4 middleware.                                                 |
| compression                     | Express 4 middleware.                                                 |
| dotenv                          | Loads environment variables from .env file.                           |
| errorhandler                    | Express 4 middleware.                                                 |
| express                         | Node.js web framework.                                                |
| express-flash                   | Provides flash messages for Express.                                  |
| express-session                 | Express 4 middleware.                                                 |
| express-validator               | Easy form validation for Express.                                     |
| lusca                           | CSRF middleware.                                                      |
| morgan                          | Express 4 middleware.                                                 |
| passport                        | Simple and elegant authentication library for node.js                 |
| passport-local                  | Sign-in with Username and Password plugin.                            |
| pug (jade)				      | Template engine for Express.                                          |
| request                         | Simplified HTTP request library.                                      |

## `devDependencies`

| Package                         | Description                                                           |
| ------------------------------- | --------------------------------------------------------------------- |
| concurrently                    | Utility that manages multiple concurrent tasks. Used with npm scripts |
| jest                            | Testing library for JavaScript.                                       |
| node-sass                       | Allows to compile .scss files to .css                                 |
| supertest                       | HTTP assertion library.                                               |
| ts-test                         | A preprocessor with sourcemap support to help use TypeScript wit Jest.|
| tslint                          | Linter (similar to ESLint) for TypeScript files                       |
| typescript                      | JavaScript compiler/type checker that boosts JavaScript productivity  |
