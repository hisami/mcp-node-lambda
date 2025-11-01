import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express from "express";
import { z } from "zod";

const server = new McpServer({
	name: "Example MCP Server",
	version: "1.0.0",
});

server.tool(
	"calculate",
	{
		a: z.number(),
		b: z.number(),
		operation: z.enum(["add", "subtract", "multiply", "divide"]),
	},
	async ({ a, b, operation }) => {
		const result = (() => {
			switch (operation) {
				case "add":
					return a + b;
				case "subtract":
					return a - b;
				case "multiply":
					return a * b;
				case "divide":
					if (b === 0) throw new Error("Division by zero");
					return a / b;
			}
		})();

		return {
			content: [
				{
					type: "text",
					text: result.toString(),
				},
			],
		};
	},
);

const app = express();
app.use(express.json());

// Streamable HTTP トランスポート（セッションレス）を設定
const transport = new StreamableHTTPServerTransport({
	sessionIdGenerator: undefined, // セッションレス
});

// ルートを設定
app.post("/mcp", async (req, res) => {
	await transport.handleRequest(req, res, req.body);
});

// サーバーを起動
server.connect(transport).then(() => {
	app.listen(8080, () => {
		console.log("MCP Server is running on http://localhost:8080/mcp");
	});
});
