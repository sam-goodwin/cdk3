const { AwsCdkConstructLibrary } = require("projen");
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
  deps: ["solc"],
  cdkDependencies: ["@aws-cdk/core", "@aws-cdk/pipelines"],

  // linting and formatting
  eslint: true,
  eslintOptions: {
    prettier: true,
    dirs: ["src"],
  },
});
project.synth();
