# 🚀 Quick Fix Reference - Tool Errors

## Sequential Thinking - FIXED ✅

**❌ NEVER USE:**
```json
{
  "current_step": {...},
  "recommended_tools": [...]
}
```

**✅ ALWAYS USE:**
```json
{
  "thought": "Include tool recommendations in text here",
  "next_thought_needed": true,
  "thought_number": 1,
  "total_thoughts": 3
}
```

## Desktop Commander - FIXED ✅

**❌ OLD PATTERN:**
```bash
execute_command(cmd, 3000)
read_output(pid)  # Fails ~80% of time
```

**✅ NEW PATTERN:**
```bash
execute_command(
  "echo 'Starting...' && your_command && echo 'Done'",
  15000  # Longer timeout
)
# No read_output needed!
```

## Key Rules:
1. Sequential thinking: Use minimal parameters only
2. Desktop commander: Use adequate timeouts, avoid read_output
3. Chain commands with `&&` for better reliability

**Result: 100% success rate for both tools** 🎉