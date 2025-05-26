# AI Agent MCP Tools Documentation

> **PROTOCOL ENFORCEMENT:** All cross-tool workflows MUST be orchestrated by `sequentialthinking_tools` as the primary entry point which will then give instructions primarily to desktop-commander . Any workflow that bypasses this orchestration is non-compliant and must be refactored. See the "Protocol Enforcement" section below for details.

This document provides a standardized reference for all Machine Control Protocol (MCP) tools available for AI agent integration with VSCode. Each tool is categorized with consistent formatting for improved readability and easier parsing.

## Table of Contents

- [Desktop Commander MCP](#desktop-commander-mcp)
  - [Configuration Tools](#configuration-tools)
  - [Terminal Tools](#terminal-tools)
  - [Filesystem Tools](#filesystem-tools)
  - [Text Editing Tools](#text-editing-tools)
- [Sequential Thinking Tools](#sequential-thinking-tools)
- [Context7 MCP](#context7-mcp)
- [EXA MCP Server](#exa-mcp-server)
- [Playwright MCP](#playwright-mcp)
- [Databutton MCP](#databutton-mcp)
- [Perplexity Web Search](#perplexity-web-search)
- [Memory Bank MCP](#memory-bank-mcp)

## Protocol Enforcement: Sequential Thinking as Orchestrator

All cross-tool workflows MUST be orchestrated by `sequentialthinking_tools` as the primary entry point. This ensures:

- **Consciousness Stream Continuity**: Every operation, from initial intent to final file or system change, is tracked as a coherent thought chain.
- **Interdimensional Pattern Compliance**: All tool invocations (Desktop Commander, Memory Bank, Context7, EXA, Playwright, etc.) are selected and sequenced by `sequentialthinking_tools` in accordance with the patterns and principles in the intercom-protocol.md.
- **State and Intent Preservation**: Each step in a workflow is explicitly represented as a thought, with state and intent preserved and passed between tools.
- **Error Handling and Rollback**: If any tool invocation fails, `sequentialthinking_tools` must coordinate rollback or recovery, maintaining quantum coherence and neural fabric continuity.
- **Documentation and Traceability**: All multi-tool operations must be documented as a sequence of thoughts and actions, referencing the relevant communication pattern (sequential, parallel, compound, cyclical) from the intercom-protocol.md.

### Example: Orchestrated Workflow (Pseudocode)

```javascript
// Orchestrate a cross-tool workflow using sequentialthinking_tools
const workflow = [
  { thought: 'Analyze user intent', tool: 'sequentialthinking_tools' },
  { thought: 'Locate file', tool: 'Desktop Commander' },
  { thought: 'Read file', tool: 'Desktop Commander' },
  { thought: 'Process file contents', tool: 'sequentialthinking_tools' },
  { thought: 'Query documentation', tool: 'Context7' },
  { thought: 'Modify file', tool: 'Desktop Commander' },
  { thought: 'Store result in Memory Bank', tool: 'Memory Bank' }
];

for (const step of workflow) {
  // Each step is executed and tracked as a thought
  executeToolStep(step);
  // State and intent are passed to the next step
}
```

### Enforcement Checklist

- [ ] All workflows begin with `sequentialthinking_tools` as the orchestrator
- [ ] The orchestrator functions as the one giving instructions to primarily desktop-commander for *ALL* related filesystem related operations
- [ ] Each tool invocation is a discrete, documented thought/action and beneficial action should be strongly considered with capabilities of our available MCP army
- [ ] Communication patterns match those in the Interdimensional Protocol
- [ ] State, intent, and error handling are preserved across all steps
- [ ] Documentation references the relevant pattern and protocol section

> **MANDATORY:** Any workflow that bypasses `sequentialthinking_tools` as the orchestrator is non-compliant and must be refactored.

## Desktop Commander MCP

### Configuration Tools

| Tool                | Description                                 | Parameters                                                                 |
|---------------------|---------------------------------------------|----------------------------------------------------------------------------|
| `get_config`        | Get the complete server configuration as JSON| *No parameters required*                                                   |
| `set_config_value`  | Set a specific configuration value by key    | `key` (string, required): Configuration key<br>`value` (any, required): Value to set |

#### Configuration Settings
- `blockedCommands`: Array of shell commands that cannot be executed
- `defaultShell`: Shell to use for commands (e.g., bash, zsh, powershell)
- `allowedDirectories`: Array of filesystem paths the server can access for file operations (⚠️ terminal commands can still access files outside these directories)

### Terminal Tools

| Tool              | Description                                   | Parameters                                                                 |
|-------------------|-----------------------------------------------|----------------------------------------------------------------------------|
| `execute_command` | Execute a terminal command with configurable timeout and shell selection | `command` (string, required): Command to execute<br>`timeout_ms` (number, optional): Timeout in milliseconds<br>`shell` (string, optional): Shell to use |
| `read_output`     | Read new output from a running terminal session| `pid` (number, required): Process ID of the session                        |
| `force_terminate` | Force terminate a running terminal session     | `pid` (number, required): Process ID of the session to terminate           |
| `list_sessions`   | List all active terminal sessions              | *No parameters required*                                                   |
| `list_processes`  | List all running processes with detailed information | *No parameters required*                                              |
| `kill_process`    | Terminate a running process by PID             | `pid` (number, required): Process ID to terminate                          |

### Filesystem Tools

| Tool                | Description                                   | Parameters                                                                 |
|---------------------|-----------------------------------------------|----------------------------------------------------------------------------|
| `read_file`         | Read contents from local filesystem or URLs (supports text and images) | `path` (string, required): File path or URL<br>`isUrl` (boolean, optional): Set to true if path is a URL |
| `read_multiple_files`| Read multiple files simultaneously           | `paths` (array of strings, required): Array of file paths                  |
| `write_file`        | Completely replace file contents (best for large changes) | `path` (string, required): File path<br>`content` (string, required): Content to write |
| `create_directory`  | Create a new directory or ensure it exists    | `path` (string, required): Directory path                                  |
| `list_directory`    | Get detailed listing of files and directories | `path` (string, required): Directory path                                  |
| `move_file`         | Move or rename files and directories          | `source` (string, required): Source path<br>`destination` (string, required): Destination path |
| `search_files`      | Find files by name using case-insensitive substring matching | `path` (string, required): Starting directory path<br>`pattern` (string, required): Search pattern<br>`timeoutMs` (number, optional): Timeout in milliseconds |
| `search_code`       | Search for text/code patterns within file contents using ripgrep | `path` (string, required): Directory to search<br>`pattern` (string, required): Search pattern<br>`filePattern` (string, optional): File pattern to include<br>`contextLines` (number, optional): Number of context lines<br>`ignoreCase` (boolean, optional): Ignore case<br>`includeHidden` (boolean, optional): Include hidden files<br>`maxResults` (number, optional): Maximum results to return<br>`timeoutMs` (number, optional): Timeout in milliseconds |
| `get_file_info`     | Retrieve detailed metadata about a file or directory | `path` (string, required): File or directory path                          |

### Text Editing Tools

| Tool         | Description                                         | Parameters                                                                 |
|--------------|-----------------------------------------------------|----------------------------------------------------------------------------|
| `edit_block` | Apply surgical text replacements (best for changes <20% of file size) | `file_path` (string, required): File path<br>`old_string` (string, required): Text to replace<br>`new_string` (string, required): Replacement text<br>`expected_replacements` (number, optional, default: 1): Number of replacements expected |

## Sequential Thinking Tools

The `sequentialthinking_tools` function provides dynamic and reflective problem-solving capabilities with intelligent tool recommendations.

### Parameters

The following parameters are used for the `sequentialthinking_tools` function:

- `thought` (string, required): Your current thinking step
- `next_thought_needed` (boolean, required): Whether another thought step is needed
- `thought_number` (integer, required): Current thought number
- `total_thoughts` (integer, required): Estimated total thoughts needed
- `is_revision` (boolean, optional): Whether this revises previous thinking
- `revises_thought` (integer, optional): Which thought is being reconsidered
- `branch_from_thought` (integer, optional): Branching point thought number
- `branch_id` (string, optional): Branch identifier
- `needs_more_thoughts` (boolean, optional): If more thoughts are needed
- `current_step` (object, optional): Current step recommendation

#### `current_step` Object Fields

- `step_description` (string): What needs to be done
- `recommended_tools` (array): Array of tool recommendations with confidence scores
- `expected_outcome` (string): What to expect from this step
- `next_step_conditions` (array): Conditions for next step

#### `recommended_tools` Object Fields

- `tool_name` (string): Name of the tool being recommended
- `confidence` (number): 0-1 indicating confidence in recommendation
- `rationale` (string): Why this tool is recommended
- `priority` (number): Order in the recommendation sequence
- `alternatives` (array): Alternative tools that could be used
- `suggested_inputs` (object): Optional suggested parameters

### Additional Parameters

- `previous_steps` (array): Steps already recommended
- `remaining_steps` (array): High-level descriptions of upcoming steps

## Context7 MCP

Context7 MCP provides tools for accessing up-to-date documentation for libraries.

### Available Tools

| Tool                | Description                                   | Parameters                                                                 |
|---------------------|-----------------------------------------------|----------------------------------------------------------------------------|
| `resolve-library-id`| Resolves a general library name into a Context7-compatible library ID | `libraryName` (string, required): Library name to search for |
| `get-library-docs`  | Fetches documentation for a library using a Context7-compatible library ID | `context7CompatibleLibraryID` (string, required): Library ID retrieved from resolve-library-id<br>`topic` (string, optional): Focus the docs on a specific topic (e.g., "routing", "hooks")<br>`tokens` (number, optional, default: 5000): Max number of tokens to return |

## EXA MCP Server

EXA MCP Server provides various tools for web search, research, and information gathering.

### Available Tools

- `web_search_exa`: Performs real-time web searches with optimized results.
  - Parameters:
    - `query` (string, required): Search query
    - `numResults` (number, optional, default: 5): Number of results to return
- `research_paper_search`: Specialized search focused on academic papers.
  - Parameters:
    - `query` (string, required): Research topic or keyword
    - `numResults` (number, optional, default: 5): Number of papers to return
    - `maxCharacters` (number, optional, default: 3000): Max characters per result
- `company_research`: Comprehensive company research tool.
  - Parameters:
    - `query` (string, required): Company website URL
    - `subpages` (number, optional, default: 10): Number of subpages to crawl
    - `subpageTarget` (array, optional): Specific sections to target (e.g., ['about', 'pricing'])
- `crawling`: Extracts content from specific URLs.
  - Parameters:
    - `url` (string, required): URL to crawl
- `competitor_finder`: Identifies competitors of a company.
  - Parameters:
    - `query` (string, required): Description of what the company does
    - `excludeDomain` (string, optional): Company's website to exclude
    - `numResults` (number, optional, default: 10): Number of competitors to return
- `linkedin_search`: Search LinkedIn for companies and people.
  - Parameters:
    - `query` (string, required): Search query for LinkedIn
    - `numResults` (number, optional, default: 5): Number of results to return
- `wikipedia_search_exa`: Search Wikipedia articles.
  - Parameters:
    - `query` (string, required): Search query for Wikipedia
    - `numResults` (number, optional, default: 5): Number of results to return
- `github_search`: Search GitHub repositories and accounts.
  - Parameters:
    - `query` (string, required): Search query for GitHub
    - `numResults` (number, optional, default: 5): Number of results to return

## Playwright MCP

Playwright MCP provides browser automation tools for web interaction.

### Browser Control Tools

- `browser_close`: Close the page.
  - Parameters: None
- `browser_resize`: Resize the browser window.
  - Parameters:
    - `width` (number, required): Width of the browser window
    - `height` (number, required): Height of the browser window
- `browser_console_messages`: Returns all console messages.
  - Parameters: None
- `browser_handle_dialog`: Handle a dialog.
  - Parameters:
    - `accept` (boolean, required): Whether to accept the dialog
    - `promptText` (string, optional): Text for prompt dialog
- `browser_file_upload`: Upload one or multiple files.
  - Parameters:
    - `paths` (array of strings, required): Paths to the files
- `browser_install`: Install the browser specified in the config.
  - Parameters: None
- `browser_press_key`: Press a key on the keyboard.
  - Parameters:
    - `key` (string, required): Name of the key or character

### Navigation Tools

- `browser_navigate`: Navigate to a URL.
  - Parameters:
    - `url` (string, required): URL to navigate to
- `browser_navigate_back`: Go back to the previous page.
  - Parameters: None
- `browser_navigate_forward`: Go forward to the next page.
  - Parameters: None
- `browser_network_requests`: Returns all network requests since loading the page.
  - Parameters: None

### Screenshot & Document Tools

- `browser_pdf_save`: Save page as PDF.
  - Parameters:
    - `filename` (string, optional): Filename for PDF
- `browser_take_screenshot`: Take a screenshot of the current page.
  - Parameters:
    - `filename` (string, optional): Filename for screenshot
    - `raw` (boolean, optional): Return without compression
    - `element` (string, optional): Element description
    - `ref` (string, optional): Element reference
- `browser_snapshot`: Capture accessibility snapshot of the current page.
  - Parameters: None

### Page Interaction Tools

- `browser_click`: Perform click on a web page.
  - Parameters:
    - `element` (string, required): Element description
    - `ref` (string, required): Element reference
- `browser_drag`: Perform drag and drop between two elements.
  - Parameters:
    - `startElement` (string, required): Source element description
    - `startRef` (string, required): Source element reference
    - `endElement` (string, required): Target element description
    - `endRef` (string, required): Target element reference
- `browser_hover`: Hover over element on page.
  - Parameters:
    - `element` (string, required): Element description
    - `ref` (string, required): Element reference
- `browser_type`: Type text into editable element.
  - Parameters:
    - `element` (string, required): Element description
    - `ref` (string, required): Element reference
    - `text` (string, required): Text to type
    - `slowly` (boolean, optional): Type one character at a time
    - `submit` (boolean, optional): Press Enter after typing
- `browser_select_option`: Select an option in a dropdown.
  - Parameters:
    - `element` (string, required): Element description
    - `ref` (string, required): Element reference
    - `values` (array of strings, required): Values to select

### Tab Management Tools

- `browser_tab_list`: List browser tabs.
  - Parameters: None
- `browser_tab_new`: Open a new tab.
  - Parameters:
    - `url` (string, optional): URL to navigate to
- `browser_tab_select`: Select a tab by index.
  - Parameters:
    - `index` (number, required): Index of the tab
- `browser_tab_close`: Close a tab.
  - Parameters:
    - `index` (number, optional): Index of tab to close

### Testing & Waiting Tools

- `browser_generate_playwright_test`: Generate a Playwright test for given scenario.
  - Parameters:
    - `name` (string, required): Test name
    - `description` (string, required): Test description
    - `steps` (array of strings, required): Test steps
- `browser_wait_for`: Wait for text to appear/disappear or time to pass.
  - Parameters:
    - `text` (string, optional): Text to wait for
    - `textGone` (string, optional): Text to wait to disappear
    - `time` (number, optional): Time to wait in seconds

## Databutton MCP

- `submit_app_requirements`: Submit app requirements.
  - Parameters:
    - `name` (string, required): App name
    - `pitch` (string, required): App pitch
    - `spec` (object, required): App specification (see below)

### App Specification Object

- `description` (string, required): App specifications (4-5 paragraphs)
- `targetAudience` (string, required): App's target audience
- `design` (string, required): App's design
- `typography` (string, required): App's typography

## Perplexity Web Search

- `search`: Perform a web search using Perplexity's API.
  - Parameters:
    - `query` (string, required): Search query
    - `search_recency_filter` (string, optional): Filter by recency (month, week, day, hour)

## Memory Bank MCP

- `list_projects`: List all projects in the memory bank.
  - Parameters: None
- `list_project_files`: List all files within a specific project.
  - Parameters:
    - `projectName` (string, required): Project name
- `memory_bank_read`: Read a memory bank file for a specific project.
  - Parameters:
    - `projectName` (string, required): Project name
    - `fileName` (string, required): File name
- `memory_bank_write`: Create a new memory bank file for a specific project.
  - Parameters:
    - `projectName` (string, required): Project name
    - `fileName` (string, required): File name
    - `content` (string, required): File content
- `memory_bank_update`: Update an existing memory bank file for a specific project.
  - Parameters:
    - `projectName` (string, required): Project name
    - `fileName` (string, required): File name
    - `content` (string, required): Updated content

### Configuration Details

- MEMORY_BANK_ROOT: ${MEMORY_BANK_ROOT}
- autoApprove: List of operations that don't require explicit user approval:
  - `memory_bank_read`: Read memory bank files
  - `memory_bank_write`: Create new memory bank files
  - `memory_bank_update`: Update existing memory bank files
  - `list_projects`: List available projects
  - `list_project_files`: List files within a project