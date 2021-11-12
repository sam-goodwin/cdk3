const { AwsCdkConstructLibrary, JsonFile } = require("projen");
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

  // dependencies
  cdkVersion: "1.132.0",
  cdkAssert: true,
  deps: ["solc"],
  bundledDeps: ["solc"],
  devDeps: [
    "@aws-cdk/aws-kms",
    "@aws-cdk/aws-secretsmanager",
    "@aws-cdk/core",
    "@aws-cdk/pipelines",
  ],
  peerDeps: [
    "@aws-cdk/aws-kms",
    "@aws-cdk/aws-secretsmanager",
    "@aws-cdk/core",
    "@aws-cdk/pipelines",
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
