/**
 * User preference personalizer for recommendations
 */

import { RecommendationPersonalizer } from './types';
import { Recommendation, RecommendationContext } from '../types';

/**
 * User preference personalizer
 */
export class UserPreferencePersonalizer implements RecommendationPersonalizer {
  name = 'UserPreferencePersonalizer';
  description = 'Personalizes recommendations based on user preferences';

  /**
   * Personalize recommendations based on user preferences
   */
  personalize(recommendations: Recommendation[], context: RecommendationContext): Recommendation[] {
    // If no user preferences, return recommendations as is
    if (!context.userPreferences) {
      return recommendations;
    }

    return recommendations.map(recommendation => {
      let personalizedRecommendation = { ...recommendation };

      // Personalize title
      if (context.userPreferences.customPreferences?.titleFormat) {
        personalizedRecommendation.title = this.formatTitle(
          personalizedRecommendation.title,
          context.userPreferences.customPreferences.titleFormat as string
        );
      }

      // Personalize description
      if (context.userPreferences.customPreferences?.descriptionFormat) {
        personalizedRecommendation.description = this.formatDescription(
          personalizedRecommendation.description,
          context.userPreferences.customPreferences.descriptionFormat as string
        );
      }

      // Personalize content
      if (context.userPreferences.customPreferences?.contentFormat) {
        personalizedRecommendation.content = this.formatContent(
          personalizedRecommendation.content,
          context.userPreferences.customPreferences.contentFormat as string
        );
      }

      // Add user-specific metadata
      if (context.userPreferences.customPreferences) {
        personalizedRecommendation.metadata = {
          ...personalizedRecommendation.metadata,
          userPreferences: context.userPreferences.customPreferences,
        };
      }

      return personalizedRecommendation;
    });
  }

  /**
   * Format title based on user preferences
   */
  private formatTitle(title: string, format: string): string {
    // This is a simplified implementation
    // In a real implementation, this would use a more sophisticated formatting system

    // Replace placeholders in format with values from title
    let formattedTitle = format.replace('{title}', title);

    // Apply other formatting
    if (format.includes('uppercase')) {
      formattedTitle = formattedTitle.toUpperCase();
    } else if (format.includes('lowercase')) {
      formattedTitle = formattedTitle.toLowerCase();
    } else if (format.includes('capitalize')) {
      formattedTitle = formattedTitle.replace(/\b\w/g, c => c.toUpperCase());
    }

    return formattedTitle;
  }

  /**
   * Format description based on user preferences
   */
  private formatDescription(description: string, format: string): string {
    // This is a simplified implementation
    // In a real implementation, this would use a more sophisticated formatting system

    // Replace placeholders in format with values from description
    let formattedDescription = format.replace('{description}', description);

    // Apply other formatting
    if (format.includes('truncate')) {
      const maxLength = parseInt(format.match(/truncate:(\d+)/)?.[1] || '100');

      if (formattedDescription.length > maxLength) {
        formattedDescription = formattedDescription.substring(0, maxLength) + '...';
      }
    }

    return formattedDescription;
  }

  /**
   * Format content based on user preferences
   */
  private formatContent(content: string, format: string): string {
    // This is a simplified implementation
    // In a real implementation, this would use a more sophisticated formatting system

    // Replace placeholders in format with values from content
    let formattedContent = format.replace('{content}', content);

    // Apply other formatting
    if (format.includes('indent')) {
      const indentSize = parseInt(format.match(/indent:(\d+)/)?.[1] || '2');
      const indent = ' '.repeat(indentSize);

      formattedContent = formattedContent
        .split('\n')
        .map(line => indent + line)
        .join('\n');
    }

    return formattedContent;
  }
}
