| name | description | license | tags |
|------|-------------|---------|------|
| mcp-builder | Scaffold and generate Model Context Protocol (MCP) servers from a tool specification. Creates server boilerplate, tool handlers, schema definitions, and test stubs. Use when building new MCP integrations for AI agents. | MIT | --- mcp ai-agents tooling scaffolding typescript |

# MCP Builder

## Overview

Scaffold production-ready Model Context Protocol (MCP) servers from a tool specification. Generates server boilerplate, typed tool handlers, JSON schema definitions, and test stubs so you can focus on business logic.

## When to Use

- When creating a new MCP server to expose tools to AI agents
- When you need to add new tools to an existing MCP server
- When scaffolding integrations for external APIs as MCP tools
- When standardizing MCP server structure across multiple integrations
- When prototyping agent tool capabilities quickly

## Instructions

1. Accept tool specification: tool name, description, input schema (JSON Schema), output schema, and any auth requirements.
2. Generate project structure:
   ```
   <server-name>/
   ├── src/
   │   ├── index.ts       # Server entry point
   │   ├── tools/
   │   │   └── <tool>.ts  # Tool handler
   │   └── types.ts       # TypeScript types
   ├── package.json
   ├── tsconfig.json
   └── README.md
   ```
3. Implement server entry point with MCP SDK initialization and tool registration.
4. Generate typed tool handler with input validation, error handling, and response formatting.
5. Create JSON Schema definitions from the tool specification.
6. Generate test stubs for each tool with example inputs and expected outputs.
7. Add environment variable handling for API keys and configuration.
8. Write README with setup, configuration, and usage instructions.
9. Return file tree and setup instructions.

## Environment

```
TARGET_LANGUAGE=typescript
MCP_SDK_VERSION=latest
INCLUDE_TESTS=true
STRICT_TYPES=true
AUTH_PATTERN=env-vars
```

## Examples

**Input:**
```
server_name: weather-mcp
tool_name: get_weather
description: Get current weather for a location
input_schema:
  location: string (required)
  units: celsius|fahrenheit (default: celsius)
output: temperature, conditions, humidity, wind_speed
auth: OPENWEATHER_API_KEY env var
```

**Output:**
```
MCP Server Scaffolded: weather-mcp
Files created: 7
- src/index.ts: Server entry with tool registration
- src/tools/get_weather.ts: Tool handler with OpenWeather API call
- src/types.ts: TypeScript interfaces
- package.json: Dependencies (mcp-sdk, zod, axios)
- tsconfig.json: Strict TypeScript config
- tests/get_weather.test.ts: Jest test stubs
- README.md: Setup and usage guide
Next: Add OPENWEATHER_API_KEY to .env and run npm install
```
