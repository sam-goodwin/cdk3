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
  gitignore: ["cdk.out", "cdk3.out"],

  scripts: {
    // scripts for deploying ands synth'ing the test app packaged in this repository.
    synth: "cdk synth",
    deploy: "cdk deploy",
  },

  // dependencies
  cdkVersion: "1.132.0",
  cdkAssert: true,
  bundledDeps: [
    "@types/aws-lambda",
    "aws-sdk",
    "ethereumjs-wallet",
    "ethers",
    "resolve",
    "solc",
  ],
  deps: [
    "@types/aws-lambda",
    "aws-sdk",
    "ethereumjs-wallet",
    "ethers",
    "resolve",
    "solc",
  ],
  devDeps: [
    "@aws-cdk/aws-ec2@1.132.0",
    "@aws-cdk/aws-ecs-patterns@1.132.0",
    "@aws-cdk/aws-ecs@1.132.0",
    "@aws-cdk/aws-elasticloadbalancingv2@1.132.0",
    "@aws-cdk/aws-iam@1.132.0",
    "@aws-cdk/aws-kms@1.132.0",
    "@aws-cdk/aws-lambda-nodejs@1.132.0",
    "@aws-cdk/aws-lambda@1.132.0",
    "@aws-cdk/aws-s3-assets@1.132.0",
    "@aws-cdk/aws-secretsmanager@1.132.0",
    "@aws-cdk/core@1.132.0",
    "@aws-cdk/pipelines@1.132.0",
    "@types/resolve",
    "constructs",
    "esbuild",
    "ethers",
    "ganache-cli",
    "ts-node",
  ],
  peerDeps: [
    "@aws-cdk/aws-ec2",
    "@aws-cdk/aws-ecs-patterns",
    "@aws-cdk/aws-ecs",
    "@aws-cdk/aws-elasticloadbalancingv2",
    "@aws-cdk/aws-iam",
    "@aws-cdk/aws-kms",
    "@aws-cdk/aws-lambda-nodejs",
    "@aws-cdk/aws-lambda",
    "@aws-cdk/aws-s3-assets",
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

bundle wallet-keygen
bundle contract-deployer`,
  ],
});

new JsonFile(project, ".vscode/launch.json", {
  obj: {
    version: "0.2.0",
    configurations: [
      {
        type: "node",
        name: "vscode-jest-tests",
        request: "launch",
        stopOnEntry: true,
        runtimeExecutable: "node",
        program: "${workspaceRoot}/node_modules/.bin/jest",
        args: ["--runInBand"],
        cwd: "${workspaceRoot}",
        console: "integratedTerminal",
        internalConsoleOptions: "neverOpen",
        disableOptimisticBPs: true,
        sourceMaps: true,
      },
    ],
  },
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
    "tslint.enable": false,
    "typescript.tsc.autoDetect": "off",
  },
});

project.synth();
