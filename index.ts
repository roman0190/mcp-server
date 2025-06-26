import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// 1. Create server
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
        text: `Roman bhai apnar ans First letter is: ${word[5]}`,
      },
    ],
  })
);

// 3. Start communication
const transport = new StdioServerTransport();
await server.connect(transport);
