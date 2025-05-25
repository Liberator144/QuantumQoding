/**
 * Language detector for detecting programming languages
 */

import { ProgrammingLanguage } from '../templates/types';

/**
 * File extension to language mapping
 */
const EXTENSION_TO_LANGUAGE: Record<string, ProgrammingLanguage> = {
  // JavaScript
  '.js': ProgrammingLanguage.JAVASCRIPT,
  '.jsx': ProgrammingLanguage.JAVASCRIPT,
  '.mjs': ProgrammingLanguage.JAVASCRIPT,
  '.cjs': ProgrammingLanguage.JAVASCRIPT,

  // TypeScript
  '.ts': ProgrammingLanguage.TYPESCRIPT,
  '.tsx': ProgrammingLanguage.TYPESCRIPT,
  '.d.ts': ProgrammingLanguage.TYPESCRIPT,

  // Python
  '.py': ProgrammingLanguage.PYTHON,
  '.pyw': ProgrammingLanguage.PYTHON,
  '.pyi': ProgrammingLanguage.PYTHON,

  // Java
  '.java': ProgrammingLanguage.JAVA,

  // C#
  '.cs': ProgrammingLanguage.CSHARP,

  // Go
  '.go': ProgrammingLanguage.GO,

  // Rust
  '.rs': ProgrammingLanguage.RUST,

  // C++
  '.cpp': ProgrammingLanguage.CPP,
  '.cc': ProgrammingLanguage.CPP,
  '.cxx': ProgrammingLanguage.CPP,
  '.c++': ProgrammingLanguage.CPP,
  '.hpp': ProgrammingLanguage.CPP,
  '.hh': ProgrammingLanguage.CPP,
  '.hxx': ProgrammingLanguage.CPP,
  '.h++': ProgrammingLanguage.CPP,
  '.h': ProgrammingLanguage.CPP,

  // PHP
  '.php': ProgrammingLanguage.PHP,

  // Ruby
  '.rb': ProgrammingLanguage.RUBY,

  // Swift
  '.swift': ProgrammingLanguage.SWIFT,

  // Kotlin
  '.kt': ProgrammingLanguage.KOTLIN,
  '.kts': ProgrammingLanguage.KOTLIN,

  // HTML
  '.html': ProgrammingLanguage.HTML,
  '.htm': ProgrammingLanguage.HTML,

  // CSS
  '.css': ProgrammingLanguage.CSS,
  '.scss': ProgrammingLanguage.CSS,
  '.sass': ProgrammingLanguage.CSS,
  '.less': ProgrammingLanguage.CSS,

  // SQL
  '.sql': ProgrammingLanguage.SQL,

  // Shell
  '.sh': ProgrammingLanguage.SHELL,
  '.bash': ProgrammingLanguage.SHELL,
  '.zsh': ProgrammingLanguage.SHELL,

  // Markdown
  '.md': ProgrammingLanguage.MARKDOWN,
  '.markdown': ProgrammingLanguage.MARKDOWN,

  // JSON
  '.json': ProgrammingLanguage.JSON,

  // YAML
  '.yml': ProgrammingLanguage.YAML,
  '.yaml': ProgrammingLanguage.YAML,

  // XML
  '.xml': ProgrammingLanguage.XML,
  '.svg': ProgrammingLanguage.XML,
  '.xhtml': ProgrammingLanguage.XML,
};

/**
 * Language detection patterns
 */
const LANGUAGE_PATTERNS: Record<ProgrammingLanguage, RegExp[]> = {
  [ProgrammingLanguage.JAVASCRIPT]: [
    /^\/\/.*|^\/\*[\s\S]*?\*\/|^import\s+.*from\s+['"].*['"];|^const\s+.*=\s+require\(['"].*['"]\);/m,
    /\bfunction\s+\w+\s*\(.*\)\s*{|\bconst\s+\w+\s*=\s*\(.*\)\s*=>\s*{/,
  ],
  [ProgrammingLanguage.TYPESCRIPT]: [
    /^\/\/.*|^\/\*[\s\S]*?\*\/|^import\s+.*from\s+['"].*['"];|^interface\s+\w+\s*{/m,
    /:\s*\w+(\[\])?\s*[,)=;{]|<\w+>|implements\s+\w+|extends\s+\w+/,
  ],
  [ProgrammingLanguage.PYTHON]: [
    /^#.*|^import\s+\w+|^from\s+\w+\s+import\s+\w+/m,
    /def\s+\w+\s*\(.*\):\s*$|class\s+\w+(\s*\(.*\))?:\s*$/m,
  ],
  [ProgrammingLanguage.JAVA]: [
    /^\/\/.*|^\/\*[\s\S]*?\*\/|^package\s+[\w.]+;|^import\s+[\w.]+;/m,
    /public\s+class\s+\w+|private\s+\w+\s+\w+;|protected\s+\w+\s+\w+;/,
  ],
  [ProgrammingLanguage.CSHARP]: [
    /^\/\/.*|^\/\*[\s\S]*?\*\/|^using\s+[\w.]+;|^namespace\s+[\w.]+/m,
    /public\s+class\s+\w+|private\s+\w+\s+\w+;|protected\s+\w+\s+\w+;/,
  ],
  [ProgrammingLanguage.GO]: [
    /^\/\/.*|^\/\*[\s\S]*?\*\/|^package\s+\w+|^import\s+\(/m,
    /func\s+\w+\s*\(.*\)\s*\w*\s*{|type\s+\w+\s+struct\s*{/,
  ],
  [ProgrammingLanguage.RUST]: [
    /^\/\/.*|^\/\*[\s\S]*?\*\/|^use\s+[\w:]+;|^fn\s+\w+/m,
    /let\s+mut\s+\w+|impl\s+\w+|struct\s+\w+|enum\s+\w+/,
  ],
  [ProgrammingLanguage.CPP]: [
    /^\/\/.*|^\/\*[\s\S]*?\*\/|^#include\s+[<"][\w.]+[>"]/m,
    /class\s+\w+|namespace\s+\w+|template\s*<|std::/,
  ],
  [ProgrammingLanguage.PHP]: [
    /^<\?php|^\/\/.*|^\/\*[\s\S]*?\*\/|^namespace\s+[\w\\]+;/m,
    /\$\w+\s*=|function\s+\w+\s*\(|class\s+\w+/,
  ],
  [ProgrammingLanguage.RUBY]: [
    /^#.*|^require\s+['"].*['"]|^module\s+\w+|^class\s+\w+/m,
    /def\s+\w+|attr_accessor\s+:\w+|do\s+\|.*\|/,
  ],
  [ProgrammingLanguage.SWIFT]: [
    /^\/\/.*|^\/\*[\s\S]*?\*\/|^import\s+\w+|^class\s+\w+/m,
    /var\s+\w+\s*:\s*\w+|func\s+\w+\s*\(|struct\s+\w+/,
  ],
  [ProgrammingLanguage.KOTLIN]: [
    /^\/\/.*|^\/\*[\s\S]*?\*\/|^package\s+[\w.]+|^import\s+[\w.]+/m,
    /fun\s+\w+\s*\(|val\s+\w+\s*:|var\s+\w+\s*:|class\s+\w+/,
  ],
  [ProgrammingLanguage.HTML]: [
    /^<!DOCTYPE\s+html>|^<html|^<head|^<body/i,
    /<div|<span|<p|<a\s+href|<img\s+src/i,
  ],
  [ProgrammingLanguage.CSS]: [
    /^\/\*[\s\S]*?\*\/|^@import\s+url\(|^@media|^\.\w+\s*{|^#\w+\s*{/m,
    /\s*{\s*[\w-]+\s*:\s*[^;]+;\s*}/,
  ],
  [ProgrammingLanguage.SQL]: [
    /^--.*|^\/\*[\s\S]*?\*\/|^SELECT\s+.*FROM|^INSERT\s+INTO|^UPDATE\s+.*SET|^DELETE\s+FROM/im,
    /CREATE\s+TABLE|ALTER\s+TABLE|DROP\s+TABLE|JOIN\s+\w+\s+ON/i,
  ],
  [ProgrammingLanguage.SHELL]: [
    /^#!.*\/(?:ba)?sh|^#.*|^export\s+\w+=|^alias\s+\w+=/m,
    /if\s+\[\s+.*\s+\];\s+then|for\s+\w+\s+in/,
  ],
  [ProgrammingLanguage.MARKDOWN]: [
    /^#\s+.*|^##\s+.*|^###\s+.*|^>\s+.*|^-\s+.*|^[0-9]+\.\s+.*/m,
    /\[.*\]\(.*\)|\*\*.*\*\*|__.*__|\*.*\*|_.*_/,
  ],
  [ProgrammingLanguage.JSON]: [
    /^{[\s\S]*}$|^\[[\s\S]*\]$/,
    /"[^"]+"\s*:\s*(?:"[^"]*"|[0-9]+|true|false|null|\{|\[)/,
  ],
  [ProgrammingLanguage.YAML]: [
    /^---$|^[\w-]+:\s*.*$|^-\s+[\w-]+:\s*.*/m,
    /^\s+[\w-]+:\s+.*$|^\s+-\s+.*$/m,
  ],
  [ProgrammingLanguage.XML]: [
    /^<\?xml\s+version=|^<!DOCTYPE|^<\w+(?:\s+\w+="[^"]*")*\s*>/,
    /<\w+>.*<\/\w+>|<\w+\s+\w+="[^"]*".*\/>/,
  ],
};

/**
 * Detect programming language from file path and content
 */
export function detectLanguage(filePath: string, content: string): ProgrammingLanguage {
  // Try to detect from file extension
  const extension = getFileExtension(filePath);
  if (extension && EXTENSION_TO_LANGUAGE[extension]) {
    return EXTENSION_TO_LANGUAGE[extension];
  }

  // Try to detect from content
  const detectedLanguage = detectLanguageFromContent(content);
  if (detectedLanguage) {
    return detectedLanguage;
  }

  // Default to JavaScript
  return ProgrammingLanguage.JAVASCRIPT;
}

/**
 * Get file extension from file path
 */
function getFileExtension(filePath: string): string | null {
  const match = filePath.match(/(\.[^./\\]+)+$/);
  return match ? match[0] : null;
}

/**
 * Detect programming language from content
 */
function detectLanguageFromContent(content: string): ProgrammingLanguage | null {
  // Calculate scores for each language
  const scores: Record<ProgrammingLanguage, number> = Object.values(ProgrammingLanguage).reduce(
    (acc, language) => {
      acc[language] = 0;
      return acc;
    },
    {} as Record<ProgrammingLanguage, number>
  );

  // Check patterns for each language
  for (const [language, patterns] of Object.entries(LANGUAGE_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(content)) {
        scores[language as ProgrammingLanguage] += 1;
      }
    }
  }

  // Find language with highest score
  let maxScore = 0;
  let detectedLanguage: ProgrammingLanguage | null = null;

  for (const [language, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      detectedLanguage = language as ProgrammingLanguage;
    }
  }

  return detectedLanguage;
}
