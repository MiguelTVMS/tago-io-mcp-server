import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { Resources } from '@tago-io/sdk';
import { z } from 'zod';
import { config } from '../config.js';
import type { IDeviceToolConfig } from '../types/index.js';
import { convertJSONToMarkdown } from '../utils/markdown.js';

// Base schema without refinement - this provides the .shape property needed by MCP
const analysisCodeBaseSchema = z
  .object({
    // Separate fields for different operations to maintain type safety
    search: z
      .array(z.string())
      .min(1)
      .max(5)
      .describe(
        'The questions to search for code. This list should contain at least 1 question and maximum 5 questions.'
      ),
    type: z
      .enum(['analysis', 'payload-parser'])
      .describe(
        'The type of code to search for. This will help the tool to return the correct code examples and SDK methods.'
      ),
  })
  .describe('Schema for analysis code search.');

type AnalysisCodeSchema = z.infer<typeof analysisCodeBaseSchema>;

async function analysisCodeSearchTool(
  _resources: Resources,
  params: AnalysisCodeSchema
): Promise<string> {
  const { search, type } = params;

  let token = 'test';
  if (!config.TEST) {
    token = config.TAGOIO_TOKEN;
  }
  const api = 'https://api.ai.tago.io';

  const response = await fetch(`${api}/rag/code`, {
    method: 'POST',
    headers: {
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      search,
      type: type,
    }),
  });

  const data = await response.json();

  const markdownResponse = convertJSONToMarkdown(data);
  return markdownResponse;
}

const codeSearchConfig: IDeviceToolConfig = {
  name: 'codeSearch',
  description: `The TagoIODocumentationSearch tool retrieves JavaScript code examples, SDK methods, and implementation guidance directly from TagoIO's documentation system. This tool searches TagoIO's knowledge base for Analysis scripts and Payload Parser examples, providing contextual code samples and best practices for specific development tasks within the TagoIO IoT platform.

Use this tool when developing TagoIO Analysis scripts (serverless compute functions), creating Payload Parsers for data transformation, implementing SDK methods, or seeking code examples for specific TagoIO features. The tool is essential for developers building IoT applications who need accurate, platform-specific implementation details and working code samples.

Do not use this tool for general programming questions unrelated to TagoIO, troubleshooting network connectivity issues, or retrieving real-time device data. Avoid using it for non-TagoIO platforms or when seeking theoretical explanations rather than practical implementation guidance.

For Analysis searches, the tool provides information about JavaScript serverless scripts that run as single files without package.json support. Analysis scripts can be triggered by Actions, Dashboard interactions, or direct API calls, and external libraries require webpack bundling via @tago-io/builder for local development.

For Payload Parser searches, the tool retrieves JavaScript decoder examples that transform incoming device data before storage.

<example>
  {
    "search": ["How to create a new device?", "How to get the device list?"],
    "type": "analysis"
  }
</example>`,
  parameters: analysisCodeBaseSchema.shape,
  title: 'Code Search',
  tool: analysisCodeSearchTool,
};

/**
 * @description Array of all analysis code search tool configurations.
 */
const analysisCodeSearchTools: IDeviceToolConfig[] = [codeSearchConfig];

/**
 * @description Handler for analysis code search tools to register tools in the MCP server.
 */
function handlerAnalysisCodeSearchTools(server: McpServer, resources: Resources) {
  for (const toolConfig of analysisCodeSearchTools) {
    server.tool(
      toolConfig.name,
      toolConfig.description,
      toolConfig.parameters,
      { title: toolConfig.title },
      async (params) => {
        const result = await toolConfig.tool(resources, params);
        return { content: [{ type: 'text', text: result }] };
      }
    );
  }
}

export { handlerAnalysisCodeSearchTools };
export { analysisCodeBaseSchema }; //export for testing purposes
