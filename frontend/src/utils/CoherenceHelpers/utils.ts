import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
/**
 * Combines multiple class names into a single string,
 * using clsx for conditional logic and tailwind-merge to handle conflicts
 *
 * @param inputs - Class values to be combined
 * @returns Merged class string
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
