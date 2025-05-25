/**
 * OpenAI Service for Knowledge Synthesis
 * Implements AI capabilities using OpenAI API
 */

import { Knowledge } from '../../types';
import {
  AIService,
  AISynthesisRequest,
  AISynthesisResponse,
  AIModelConfig,
  DEFAULT_AI_MODEL_CONFIG,
} from './ai-service';

/**
 * OpenAI API client interface
 * This is a simplified interface for demonstration purposes
 */
interface OpenAIClient {
  createCompletion(params: any): Promise<any>;
  createChatCompletion(params: any): Promise<any>;
}

/**
 * OpenAI service for knowledge synthesis
 */
export class OpenAIService implements AIService {
  name: string = 'OpenAI';
  private client: OpenAIClient;

  constructor(client: OpenAIClient) {
    this.client = client;
  }

  /**
   * Synthesize knowledge using OpenAI
   */
  async synthesize(request: AISynthesisRequest): Promise<AISynthesisResponse> {
    // Merge model config with defaults
    const modelConfig: AIModelConfig = {
      ...DEFAULT_AI_MODEL_CONFIG,
      ...request.modelConfig,
    };

    // Create prompt for synthesis
    const prompt = this.createSynthesisPrompt(request);

    // Call OpenAI API
    const response = await this.client.createChatCompletion({
      model: modelConfig.model,
      messages: [
        { role: 'system', content: this.createSystemPrompt(request) },
        { role: 'user', content: prompt },
      ],
      temperature: modelConfig.temperature,
      max_tokens: modelConfig.maxTokens,
      ...modelConfig.parameters,
    });

    // Parse response
    const content = response.choices[0].message.content;
    const parsedResponse = this.parseAIResponse(content);

    // Generate additional components
    const title = await this.generateTitle(request.primaryKnowledge, request.additionalKnowledge);

    const description = await this.generateDescription(
      request.primaryKnowledge,
      request.additionalKnowledge,
      parsedResponse.content
    );

    const explanation = await this.generateExplanation(
      request.primaryKnowledge,
      request.additionalKnowledge,
      parsedResponse.content,
      request.operationType
    );

    const quality = await this.evaluateQuality(
      parsedResponse.content,
      request.primaryKnowledge,
      request.additionalKnowledge
    );

    // Create synthesis response
    return {
      content: parsedResponse.content,
      title,
      description,
      explanation,
      notes: quality.notes,
      suggestions: quality.suggestions,
      confidence: quality.confidence,
      usage: {
        promptTokens: response.usage.prompt_tokens,
        completionTokens: response.usage.completion_tokens,
        totalTokens: response.usage.total_tokens,
      },
    };
  }

  /**
   * Generate a title for synthesized knowledge
   */
  async generateTitle(
    primaryKnowledge: Knowledge,
    additionalKnowledge: Knowledge[]
  ): Promise<string> {
    const prompt = `
Generate a concise, descriptive title for a new knowledge entity that combines the following:

Primary knowledge: "${primaryKnowledge.title}"
Additional knowledge: ${additionalKnowledge.map(k => `"${k.title}"`).join(', ')}

The title should be clear, specific, and under 10 words.
`;

    const response = await this.client.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that generates concise, descriptive titles.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 50,
    });

    return response.choices[0].message.content.trim().replace(/^"(.+)"$/, '$1');
  }

  /**
   * Generate a description for synthesized knowledge
   */
  async generateDescription(
    primaryKnowledge: Knowledge,
    additionalKnowledge: Knowledge[],
    synthesizedContent: string
  ): Promise<string> {
    const prompt = `
Generate a concise description (1-2 sentences) for a new knowledge entity that combines the following:

Primary knowledge: "${primaryKnowledge.title}" - ${primaryKnowledge.description}
Additional knowledge: ${additionalKnowledge.map(k => `"${k.title}" - ${k.description}`).join('\n')}

The description should explain what the combined knowledge does and its key benefits.
`;

    const response = await this.client.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that generates concise descriptions.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 100,
    });

    return response.choices[0].message.content.trim();
  }

  /**
   * Generate an explanation of the synthesis process
   */
  async generateExplanation(
    primaryKnowledge: Knowledge,
    additionalKnowledge: Knowledge[],
    synthesizedContent: string,
    operationType: string
  ): Promise<string> {
    const prompt = `
Generate an explanation of how the following knowledge entities were synthesized:

Primary knowledge: "${primaryKnowledge.title}" - ${primaryKnowledge.description}
Additional knowledge: ${additionalKnowledge.map(k => `"${k.title}" - ${k.description}`).join('\n')}
Operation type: ${operationType}

Explain the synthesis process, what was combined, and how the components work together.
`;

    const response = await this.client.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that explains technical processes clearly.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    return response.choices[0].message.content.trim();
  }

  /**
   * Evaluate the quality of synthesized knowledge
   */
  async evaluateQuality(
    synthesizedContent: string,
    primaryKnowledge: Knowledge,
    additionalKnowledge: Knowledge[]
  ): Promise<{
    confidence: number;
    notes: string[];
    suggestions: string[];
  }> {
    const prompt = `
Evaluate the quality of the following synthesized knowledge:

Synthesized content:
\`\`\`
${synthesizedContent}
\`\`\`

Primary knowledge: "${primaryKnowledge.title}" - ${primaryKnowledge.description}
Additional knowledge: ${additionalKnowledge.map(k => `"${k.title}" - ${k.description}`).join('\n')}

Provide:
1. A confidence score (0-1) indicating how well the synthesis combines the source knowledge
2. Notes about the synthesis quality (list format)
3. Suggestions for improvement (list format)

Format your response as JSON:
{
  "confidence": 0.8,
  "notes": ["Note 1", "Note 2"],
  "suggestions": ["Suggestion 1", "Suggestion 2"]
}
`;

    const response = await this.client.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful assistant that evaluates code quality and provides structured feedback in JSON format.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    try {
      const result = JSON.parse(response.choices[0].message.content);
      return {
        confidence: result.confidence,
        notes: result.notes,
        suggestions: result.suggestions,
      };
    } catch (error) {
      // Fallback if JSON parsing fails
      return {
        confidence: 0.5,
        notes: ['Could not parse evaluation response'],
        suggestions: ['Review the synthesized content manually'],
      };
    }
  }

  /**
   * Create system prompt for synthesis
   */
  private createSystemPrompt(request: AISynthesisRequest): string {
    return `
You are an expert software developer specializing in knowledge synthesis.
Your task is to combine multiple code patterns or best practices into a unified, coherent solution.
Focus on creating high-quality, maintainable code that effectively combines the strengths of each input.
Provide your response in a structured format that can be parsed programmatically.
`;
  }

  /**
   * Create prompt for synthesis
   */
  private createSynthesisPrompt(request: AISynthesisRequest): string {
    return `
I need you to synthesize a new solution by combining the following knowledge:

PRIMARY KNOWLEDGE:
Title: ${request.primaryKnowledge.title}
Description: ${request.primaryKnowledge.description}
Content:
\`\`\`
${request.primaryKnowledge.content}
\`\`\`

ADDITIONAL KNOWLEDGE:
${request.additionalKnowledge
  .map(
    (k, i) => `
[${i + 1}] Title: ${k.title}
Description: ${k.description}
Content:
\`\`\`
${k.content}
\`\`\`
`
  )
  .join('\n')}

OPERATION TYPE: ${request.operationType}

${request.instructions ? `SPECIFIC INSTRUCTIONS: ${request.instructions}` : ''}

TARGET PROJECT: ${request.targetProjectId}

Please synthesize these into a unified solution that combines their strengths.
Format your response as follows:

CONTENT:
\`\`\`
// Your synthesized code here
\`\`\`

NOTES:
- Note 1
- Note 2

SUGGESTIONS:
- Suggestion 1
- Suggestion 2
`;
  }

  /**
   * Parse AI response
   */
  private parseAIResponse(response: string): {
    content: string;
    notes: string[];
    suggestions: string[];
  } {
    // Extract content
    const contentMatch = response.match(/CONTENT:\s*```(?:\w*\n)?([\s\S]*?)```/);
    const content = contentMatch ? contentMatch[1].trim() : '';

    // Extract notes
    const notesMatch = response.match(/NOTES:\s*([\s\S]*?)(?=SUGGESTIONS:|$)/);
    const notesText = notesMatch ? notesMatch[1].trim() : '';
    const notes = notesText
      .split('\n')
      .map(line => line.replace(/^-\s*/, '').trim())
      .filter(line => line.length > 0);

    // Extract suggestions
    const suggestionsMatch = response.match(/SUGGESTIONS:\s*([\s\S]*?)(?=$)/);
    const suggestionsText = suggestionsMatch ? suggestionsMatch[1].trim() : '';
    const suggestions = suggestionsText
      .split('\n')
      .map(line => line.replace(/^-\s*/, '').trim())
      .filter(line => line.length > 0);

    return {
      content,
      notes,
      suggestions,
    };
  }
}
