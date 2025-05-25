/**
 * AI Factory for Knowledge Synthesis
 * Creates and configures AI services
 */

import { AIService } from './ai-service';
import { OpenAIService } from './openai-service';
import { SynthesisManager } from '../synthesis-manager';
import { ProjectContextManager } from '../../project-context';
import { AISynthesisStrategy } from '../strategies/ai-synthesis-strategy';

/**
 * OpenAI configuration
 */
export interface OpenAIConfig {
  /** API key */
  apiKey: string;

  /** Organization ID (optional) */
  organization?: string;

  /** API base URL (optional) */
  baseURL?: string;
}

/**
 * Mock OpenAI client for demonstration
 */
class MockOpenAIClient {
  constructor(config: OpenAIConfig) {
    // In a real implementation, this would initialize the OpenAI client
    console.log('Initializing OpenAI client with config:', config);
  }

  async createCompletion(params: any): Promise<any> {
    // Mock implementation
    return {
      choices: [
        {
          text: 'Mock completion response',
        },
      ],
      usage: {
        prompt_tokens: 100,
        completion_tokens: 50,
        total_tokens: 150,
      },
    };
  }

  async createChatCompletion(params: any): Promise<any> {
    // Mock implementation
    return {
      choices: [
        {
          message: {
            content: `
CONTENT:
\`\`\`
function combinedPattern() {
  // Combined implementation
  console.log('This is a mock combined pattern');
  return 'Mock result';
}
\`\`\`

NOTES:
- This is a mock implementation
- It demonstrates the format

SUGGESTIONS:
- Replace with actual implementation
- Add proper error handling
`,
          },
        },
      ],
      usage: {
        prompt_tokens: 200,
        completion_tokens: 100,
        total_tokens: 300,
      },
    };
  }
}

/**
 * Factory for creating AI services
 */
export class AIFactory {
  /**
   * Create an OpenAI service
   */
  static createOpenAIService(config: OpenAIConfig): AIService {
    // In a real implementation, this would use the actual OpenAI client
    const client = new MockOpenAIClient(config);
    return new OpenAIService(client);
  }

  /**
   * Create a mock AI service for testing
   */
  static createMockAIService(): AIService {
    const client = new MockOpenAIClient({ apiKey: 'mock-key' });
    return new OpenAIService(client);
  }

  /**
   * Integrate AI with synthesis manager
   */
  static integrateWithSynthesisManager(
    synthesisMgr: SynthesisManager,
    aiService: AIService,
    projectMgr: ProjectContextManager
  ): void {
    // Create AI synthesis strategy
    const aiStrategy = new AISynthesisStrategy(projectMgr, aiService);

    // Register strategy with synthesis manager
    synthesisMgr.registerStrategy(aiStrategy);

    console.log(`Integrated ${aiService.name} with synthesis manager`);
  }
}
