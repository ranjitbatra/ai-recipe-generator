// amplify/backend.ts
import { defineBackend } from "@aws-amplify/backend";
import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";

const backend = defineBackend({});

// --- Lambda: basicWebappHandler (Node.js 20) ---
const basicWebappHandler = new lambda.Function(backend.stack, "BasicWebappHandler", {
  runtime: lambda.Runtime.NODEJS_20_X,
  handler: "index.handler",
  code: lambda.Code.fromAsset("lambda/basicWebappHandler"),
  timeout: cdk.Duration.seconds(15),
  memorySize: 256,
});

export { basicWebappHandler };
