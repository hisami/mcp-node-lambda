import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import type { Construct } from "constructs";

export class InfraStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		const lambdaFunction = new lambda.DockerImageFunction(
			this,
			"McpNodeLambda",
			{
				functionName: "mcp-node-lambda",
				code: lambda.DockerImageCode.fromImageAsset("../"),
				architecture: lambda.Architecture.ARM_64,
				timeout: cdk.Duration.seconds(30),
				memorySize: 512,
			},
		);

		const functionUrl = lambdaFunction.addFunctionUrl({
			authType: lambda.FunctionUrlAuthType.NONE,
			cors: {
				allowedOrigins: ["*"],
				allowedHeaders: ["*"],
				allowedMethods: [lambda.HttpMethod.ALL],
			},
		});

		new cdk.CfnOutput(this, "LambdaFunctionUrl", {
			value: functionUrl.url,
		});
	}
}
