import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Calculates the percentage of spent amount relative to total amount
 * @param spent - The amount spent (numerator)
 * @param total - The total amount (denominator)
 * @param maxPercentage - Optional maximum percentage to cap at (default: 100)
 * @returns Rounded percentage value between 0 and maxPercentage
 * 
 * @example
 * calculatePercentage(50, 100) // 50
 * calculatePercentage(75, 100) // 75
 * calculatePercentage(0, 0) // 0
 * calculatePercentage(150, 100) // 100
 */
export function calculatePercentage(
  spent: number,
  total: number,
  maxPercentage: number = 100
): number {
  if (total <= 0) return 0;
  const percentage = (spent / total) * 100;
  return Math.min(Math.max(Math.round(percentage), 0), maxPercentage);
}
