/**
 * Formats a number as Indian currency with commas
 * @param amount - The amount to format (number or string)
 * @param showDecimals - Whether to show decimal places (default: true)
 * @returns Formatted string with ₹ symbol and Indian number format
 * 
 * @example
 * formatIndianCurrency(1234567.89) // "₹12,34,567.89"
 * formatIndianCurrency(1234567.89, false) // "₹12,34,568"
 * formatIndianCurrency(1000) // "₹1,000.00"
 */
export function formatIndianCurrency(
  amount: number | string,
  showDecimals: boolean = true
): string {
  // Convert to number if string
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Handle invalid numbers
  if (isNaN(numAmount)) {
    return '₹0';
  }

  // Format with Indian numbering system (lakhs and crores)
  // Indian system: 1,00,000 (1 lakh), 1,00,00,000 (1 crore)
  const options: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
    useGrouping: true,
  };

  // Use Indian locale for proper formatting
  const formatted = new Intl.NumberFormat('en-IN', options).format(numAmount);
  
  return formatted;
}

/**
 * Formats a number in compact notation (e.g., 11k, 1.5L, 2.3Cr)
 * @param amount - The amount to format (number or string)
 * @param showDecimals - Whether to show decimal places for compact format (default: true)
 * @returns Formatted string with Indian compact notation
 * 
 * @example
 * formatCompactCurrency(11000) // "11k"
 * formatCompactCurrency(150000) // "1.5L"
 * formatCompactCurrency(23000000) // "2.3Cr"
 * formatCompactCurrency(500) // "500"
 */
export function formatCompactCurrency(
  amount: number | string,
  showDecimals: boolean = true
): string {
  // Convert to number if string
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Handle invalid numbers
  if (isNaN(numAmount)) {
    return '0';
  }

  const absAmount = Math.abs(numAmount);
  const sign = numAmount < 0 ? '-' : '';

  // Indian numbering system:
  // 1,000 = 1k (thousand)
  // 1,00,000 = 1L (lakh)
  // 1,00,00,000 = 1Cr (crore)

  if (absAmount >= 10000000) {
    // Crores (1,00,00,000 and above)
    const crores = absAmount / 10000000;
    if (showDecimals && crores % 1 !== 0) {
      return `${sign}${crores.toFixed(1)}Cr`;
    }
    return `${sign}${Math.round(crores)}Cr`;
  } else if (absAmount >= 100000) {
    // Lakhs (1,00,000 to 99,99,999)
    const lakhs = absAmount / 100000;
    if (showDecimals && lakhs % 1 !== 0) {
      return `${sign}${lakhs.toFixed(1)}L`;
    }
    return `${sign}${Math.round(lakhs)}L`;
  } else if (absAmount >= 1000) {
    // Thousands (1,000 to 99,999)
    const thousands = absAmount / 1000;
    if (showDecimals && thousands % 1 !== 0) {
      return `${sign}${thousands.toFixed(1)}k`;
    }
    return `${sign}${Math.round(thousands)}k`;
  } else {
    // Less than 1000, return as is
    return `${sign}${Math.round(absAmount)}`;
  }
}

/**
 * Formats a number as Indian currency with compact notation
 * Combines both functions - shows compact format with ₹ symbol
 * @param amount - The amount to format (number or string)
 * @param showDecimals - Whether to show decimal places (default: true)
 * @returns Formatted string with ₹ symbol and compact notation
 * 
 * @example
 * formatCurrencyCompact(11000) // "₹11k"
 * formatCurrencyCompact(150000) // "₹1.5L"
 * formatCurrencyCompact(23000000) // "₹2.3Cr"
 */
export function formatCurrencyCompact(
  amount: number | string,
  showDecimals: boolean = true
): string {
  const compact = formatCompactCurrency(amount, showDecimals);
  return `₹${compact}`;
}

