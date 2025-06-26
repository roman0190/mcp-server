import express from "express";
import cors from "cors";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";
import { randomUUID } from "crypto";

// 1. Create MCP server
const server = new McpServer({
  name: "first-letter-server",
  version: "1.0.0",
});

// 2. Register the "first-letter" tool
server.registerTool(
  "first-letter",
  {
    title: "First Letter Extractor",
    description: "Returns the first letter of a given word",
    inputSchema: {
      word: z.string(),
    },
  },
  async ({ word }) => ({
    content: [
      {
        type: "text",
        text: `First letter is: ${word[0]}`,
      },
    ],
  })
);

// 3. Setup Express server - minimal version
const app = express();
app.use(express.json());

// Add CORS support for Cursori AI
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "mcp-session-id", "Origin", "Accept"],
  })
);

// Store active transports
const transports = new Map<string, StreamableHTTPServerTransport>();

// Main MCP endpoint using StreamableHTTP for Cursori AI
app.all("/mcp", async (req, res) => {
  // Check for existing session ID
  const sessionId = req.headers["mcp-session-id"] as string | undefined;
  let transport: StreamableHTTPServerTransport;

  if (sessionId && transports.has(sessionId)) {
    // Reuse existing transport
    transport = transports.get(sessionId)!;
  } else {
    // Create new transport
    transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
      onsessioninitialized: (id: string) => {
        console.log(`New session initialized: ${id}`);
        transports.set(id, transport);
      },
    });

    // Connect to the server
    await server.connect(transport);

    // Clean up when session is closed
    transport.onclose = () => {
      if (transport.sessionId) {
        console.log(`Session closed: ${transport.sessionId}`);
        transports.delete(transport.sessionId);
      }
    };
  }

  console.log(`Handling MCP request, sessionId: ${sessionId || "new"}`);

  // Handle the request
  await transport.handleRequest(req, res);
});

// Simple status check endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "MCP Server running",
    endpoint: "/mcp",
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ MCP Server running at http://localhost:${PORT}`);
  console.log(`📡 MCP endpoint available at http://localhost:${PORT}/mcp`);
});
