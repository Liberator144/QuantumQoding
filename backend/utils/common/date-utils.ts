/**
 * Date Utilities
 * 
 * This module provides utility functions for date formatting and manipulation.
 * 
 * @version 1.0.0
 */

/**
 * Format date as YYYY-MM-DD
 * @param date - Date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date | string | number): string {
  try {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  } catch (error) {
    return String(date);
  }
}

/**
 * Format time as HH:MM:SS
 * @param date - Date to format
 * @returns Formatted time string
 */
export function formatTime(date: Date | string | number): string {
  try {
    const d = new Date(date);
    return d.toISOString().split('T')[1].split('.')[0];
  } catch (error) {
    return String(date);
  }
}

/**
 * Format date and time
 * @param date - Date to format
 * @returns Formatted date and time string
 */
export function formatDateTime(date: Date | string | number): string {
  try {
    const d = new Date(date);
    return d.toISOString().replace('T', ' ').split('.')[0];
  } catch (error) {
    return String(date);
  }
}

/**
 * Format date with localization
 * @param date - Date to format
 * @param locale - Locale string (default: system locale)
 * @returns Localized date string
 */
export function formatLocalDate(
  date: Date | string | number,
  locale?: string
): string {
  try {
    const d = new Date(date);
    return d.toLocaleDateString(locale);
  } catch (error) {
    return String(date);
  }
}

/**
 * Format time with localization
 * @param date - Date to format
 * @param locale - Locale string (default: system locale)
 * @returns Localized time string
 */
export function formatLocalTime(
  date: Date | string | number,
  locale?: string
): string {
  try {
    const d = new Date(date);
    return d.toLocaleTimeString(locale);
  } catch (error) {
    return String(date);
  }
}

/**
 * Format date and time with localization
 * @param date - Date to format
 * @param locale - Locale string (default: system locale)
 * @returns Localized date and time string
 */
export function formatLocalDateTime(
  date: Date | string | number,
  locale?: string
): string {
  try {
    const d = new Date(date);
    return d.toLocaleString(locale);
  } catch (error) {
    return String(date);
  }
}

/**
 * Format duration in milliseconds
 * @param milliseconds - Duration in milliseconds
 * @returns Formatted duration string (HH:MM:SS)
 */
export function formatDuration(milliseconds: number): string {
  if (isNaN(milliseconds) || milliseconds < 0) {
    return '00:00:00';
  }
  
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0')
  ].join(':');
}

/**
 * Get relative time string (e.g., "2 hours ago")
 * @param date - Date to format
 * @param relativeTo - Reference date (default: now)
 * @returns Relative time string
 */
export function getRelativeTimeString(
  date: Date | string | number,
  relativeTo: Date | string | number = new Date()
): string {
  try {
    const d1 = new Date(date);
    const d2 = new Date(relativeTo);
    
    const diffMs = d2.getTime() - d1.getTime();
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHour / 24);
    const diffMonth = Math.round(diffDay / 30);
    const diffYear = Math.round(diffDay / 365);
    
    if (diffSec < 5) {
      return 'just now';
    } else if (diffSec < 60) {
      return `${diffSec} seconds ago`;
    } else if (diffMin < 60) {
      return diffMin === 1 ? 'a minute ago' : `${diffMin} minutes ago`;
    } else if (diffHour < 24) {
      return diffHour === 1 ? 'an hour ago' : `${diffHour} hours ago`;
    } else if (diffDay < 30) {
      return diffDay === 1 ? 'yesterday' : `${diffDay} days ago`;
    } else if (diffMonth < 12) {
      return diffMonth === 1 ? 'a month ago' : `${diffMonth} months ago`;
    } else {
      return diffYear === 1 ? 'a year ago' : `${diffYear} years ago`;
    }
  } catch (error) {
    return String(date);
  }
}
