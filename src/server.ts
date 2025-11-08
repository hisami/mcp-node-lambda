import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express from "express";
import { z } from "zod";

const server = new McpServer({
	name: "Example MCP Server",
	version: "1.0.0",
});

server.registerTool(
	"calculate-bmi",
	{
		title: "BMI Calculator",
		description: "Calculate Body Mass Index",
		inputSchema: {
			weightKg: z.number(),
			heightM: z.number(),
		},
		outputSchema: { bmi: z.number() },
	},
	async ({ weightKg, heightM }) => {
		const output = { bmi: weightKg / (heightM * heightM) };
		return {
			content: [
				{
					type: "text",
					text: JSON.stringify(output),
				},
			],
			structuredContent: output,
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
