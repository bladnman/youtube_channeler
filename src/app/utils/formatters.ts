/**
 * Formats a number into a human-readable string with K, M, B suffixes
 * Examples:
 * - 1234 -> 1.2K
 * - 12345 -> 12.3K
 * - 123456 -> 123K
 * - 1234567 -> 1.2M
 * - 12345678 -> 12.3M
 * - 123456789 -> 123M
 * - 1234567890 -> 1.2B
 */
export const formatCompactNumber = (numStr?: string | number): string => {
  if (!numStr) return '0';
  
  const num = typeof numStr === 'string' ? parseInt(numStr) : numStr;
  if (isNaN(num)) return '0';

  const absNum = Math.abs(num);
  
  if (absNum < 1000) return num.toString();
  
  const suffixes = ['', 'K', 'M', 'B', 'T'];
  const magnitude = Math.floor(Math.log10(absNum) / 3);
  const scaledNum = num / Math.pow(1000, magnitude);
  const suffix = suffixes[magnitude];

  // For numbers less than 10 after scaling (e.g., 1.2K, 2.5M), show one decimal
  // For numbers between 10 and 100 after scaling (e.g., 12K, 45M), show one decimal
  // For numbers >= 100 after scaling (e.g., 123K, 999M), show no decimals
  const decimals = scaledNum >= 100 ? 0 : 1;
  
  return `${scaledNum.toFixed(decimals)}${suffix}`;
} 