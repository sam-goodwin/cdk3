const { AwsCdkConstructLibrary, JsonFile, TextFile } = require("projen");
const project = new AwsCdkConstructLibrary({
  name: "cdk3",
  author: "Sam Goodwin",
  authorAddress: "sam@shapes.org",
  license: "Apache-2.0",
  repositoryUrl: "git@github.com:punchcard/cdk3.git",

  // release
  release: true,
  releaseToNpm: true,
  majorVersion: 0,
  defaultReleaseBranch: "main",

  // for cases when we deploy a CDK app within this project
  gitignore: ["cdk.out"],

  // dependencies
  cdkVersion: "1.132.0",
  cdkAssert: true,
  bundledDeps: ["solc", "ethereumjs-wallet", "@types/aws-lambda", "aws-sdk"],
  deps: ["solc", "ethereumjs-wallet", "@types/aws-lambda", "aws-sdk"],
  devDeps: [
    "@aws-cdk/aws-kms@1.132.0",
    "@aws-cdk/aws-lambda-nodejs@1.132.0",
    "@aws-cdk/aws-lambda@1.132.0",
    "@aws-cdk/aws-secretsmanager@1.132.0",
    "@aws-cdk/core@1.132.0",
    "@aws-cdk/pipelines@1.132.0",
    "constructs",
    "esbuild",
    "ts-node",
  ],
  peerDeps: [
    "@aws-cdk/aws-kms",
    "@aws-cdk/aws-lambda-nodejs",
    "@aws-cdk/aws-lambda",
    "@aws-cdk/aws-secretsmanager",
    "@aws-cdk/core",
    "@aws-cdk/pipelines",
    "constructs",
  ],

  // linting and formatting
  eslint: true,
  eslintOptions: {
    prettier: true,
    dirs: ["src"],
  },

  // automatically upgrade all dependencies with projen
  depsUpgrade: true,

  // testing
  jest: true,
});

// bundle our lambdas with esbuild
project.preCompileTask.exec("./scripts/bundle");

new TextFile(project, "scripts/bundle", {
  readonly: true,
  executable: true,
  lines: [
    `#!/usr/bin/env bash

function bundle() {
  name=$1
  mkdir -p lib/$name
  esbuild src/$name.ts --bundle --platform=node --outfile=lib/$name/index.js --external:aws-sdk
}

bundle wallet-keygen`,
  ],
});

new JsonFile(project, ".vscode/settings.json", {
  readonly: true,
  obj: {
    "[javascript]": {
      "editor.defaultFormatter": "esbenp.prettier-vscode",
      "editor.formatOnSave": true,
    },
    "[json]": {
      "editor.defaultFormatter": "esbenp.prettier-vscode",
      "editor.formatOnSave": true,
    },
    "[jsonc]": {
      "editor.defaultFormatter": "esbenp.prettier-vscode",
      "editor.formatOnSave": true,
    },
    "[typescript]": {
      "editor.defaultFormatter": "esbenp.prettier-vscode",
      "editor.formatOnSave": true,
    },
    "[markdown]": {
      "editor.defaultFormatter": "esbenp.prettier-vscode",
      "editor.formatOnSave": true,
      "editor.quickSuggestions": true,
      "editor.suggest.showReferences": true,
      "editor.wordWrap": "on",
    },
    "[yaml]": {
      "editor.defaultFormatter": "esbenp.prettier-vscode",
      "editor.formatOnSave": true,
    },
    "editor.tabSize": 2,
    "editor.insertSpaces": true,
    "editor.formatOnSave": true,
    "eslint.format.enable": false,
    "jest.pathToConfig": "jest.config.ts",
    "tslint.enable": false,
    "typescript.tsc.autoDetect": "off",
  },
});

project.synth();
