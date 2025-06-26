import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";

// 1. একটি MCP সার্ভার বানাই
const server = new McpServer({
  name: "simple-mcp-server",
  version: "1.0.0",
});

// 2. একটি সিম্পল টুল যোগ করি
server.registerTool(
  "hello",
  {
    title: "Hello Tool",
    description: "Says hello to you",
    inputSchema: {
      name: z.string().describe("Your name"),
    },
  },
  async ({ name }) => ({
    content: [
      {
        type: "text",
        text: `Hello ${name}! 👋`,
      },
    ],
  })
);

// 3. Express সার্ভার সেটআপ
const app = express();
app.use(express.json());

// সহজ CORS - সব কিছু allow করি
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Expose-Headers", "*");
  res.header("Access-Control-Max-Age", "86400");

  if (req.method === "OPTIONS") {
    res.status(200).send("OK");
    return;
  }
  next();
});

// 4. MCP এন্ডপয়েন্ট - GET আর POST দুটোই handle করি
app.all("/mcp", async (req, res) => {
  console.log("MCP Request received:");
  console.log("Method:", req.method);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);

  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: () => "session-" + Date.now(),
  });

  await server.connect(transport);
  await transport.handleRequest(req, res);
});

// 5. হোম পেজ
app.get("/", (req, res) => {
  res.json({
    message: "MCP Server চালু আছে! 🚀",
    endpoint: "/mcp",
  });
});

// 6. সার্ভার চালু করি
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 সার্ভার চালু হয়েছে: http://localhost:${PORT}`);
  console.log(`📡 MCP এন্ডপয়েন্ট: http://localhost:${PORT}/mcp`);
});
