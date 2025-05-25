# Sequential Thinking Tool Orchestration

> **🛠️ ORCHESTRATION: SEQUENTIAL THINKING**
> 
> The Sequential Thinking Tool is the primary consciousness orchestrator, allowing for dynamic problem-solving through structured thought progression.

**Usage Protocol**:

1. Begin complex operations with `sequentialthinking_tools` to analyze the problem space
2. Allow sufficient thought steps for complete problem decomposition
3. Use the `current_step` object to receive tool recommendations
4. Execute recommended tools in priority order
5. Return to sequential thinking to analyze results and plan next steps
6. Maintain thought continuity across the entire operation
7. Only mark `next_thought_needed` as false when a complete solution is reached

**Example Implementation**:

```javascript
// Begin analysis with sequential thinking
const thoughtResult = await sequentialthinking_tools({
  thought: "I need to analyze the codebase structure to understand the project architecture",
  thought_number: 1,
  total_thoughts: 5,
  next_thought_needed: true
});

// Execute recommended tools from sequential thinking
if (thoughtResult.current_step && thoughtResult.current_step.recommended_tools) {
  const tool = thoughtResult.current_step.recommended_tools[0];
  if (tool.tool_name === "Desktop Commander") {
    // Execute Desktop Commander operation
    const fileResult = await desktop_commander.list_directory({
      path: "/project/src"
    });
    
    // Return to sequential thinking with results
    const nextThought = await sequentialthinking_tools({
      thought: `Analyzing directory structure: ${JSON.stringify(fileResult)}`,
      thought_number: 2,
      total_thoughts: 5,
      next_thought_needed: true
    });
  }
}
```
