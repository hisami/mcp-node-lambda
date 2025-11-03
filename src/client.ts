import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import type { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";

const transport = new StreamableHTTPClientTransport(
	new URL("http://localhost:8080/mcp"),
);

const client = new Client({
	name: "Example MCP Client",
	version: "1.0.0",
});

const main = async (): Promise<void> => {
	await client.connect(transport as Transport);

	// 利用可能なツールのリストを取得
	const tools = await client.listTools();
	console.log("Available tools:", tools);

	// "calculate" ツールを呼び出す
	const calculateResult = await client.callTool({
		name: "calculate",
		arguments: { a: 10, b: 5, operation: "add" },
	});

	console.log("Calculation result:", calculateResult.content);
};

main().catch((error) => {
	console.error("Error in MCP Client:", error);
});
