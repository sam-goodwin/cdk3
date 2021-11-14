import "jest";

import * as cdk from "@aws-cdk/core";

export function stackTest(
  block: (stack: cdk.Stack, app: cdk.App) => void
): () => void {
  return () => {
    const app = new cdk.App({
      autoSynth: false,
    });
    const stack = new cdk.Stack(app, "Test");

    block(stack, app);

    app.synth();

    expect((stack as any)._toCloudFormation()).toMatchSnapshot();
  };
}
