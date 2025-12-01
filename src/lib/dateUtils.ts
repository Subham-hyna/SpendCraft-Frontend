import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

/**
 * Gets the user's timezone
 * @returns The user's timezone string (e.g., 'Asia/Kolkata', 'America/New_York')
 */
export function getUserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * Gets the current date and time in the user's timezone
 * @param format - Optional format string (default: 'YYYY-MM-DD HH:mm:ss')
 * @returns Formatted date string in user's timezone
 * 
 * @example
 * getCurrentDateTime() // "2024-01-15 14:30:45"
 * getCurrentDateTime('DD/MM/YYYY HH:mm') // "15/01/2024 14:30"
 */
export function getCurrentDateTime(format: string = 'YYYY-MM-DD HH:mm:ss'): string {
  return dayjs().tz(getUserTimezone()).format(format);
}

/**
 * Gets the current date in the user's timezone
 * @param format - Optional format string (default: 'YYYY-MM-DD')
 * @returns Formatted date string
 * 
 * @example
 * getCurrentDate() // "2024-01-15"
 * getCurrentDate('DD/MM/YYYY') // "15/01/2024"
 */
export function getCurrentDate(format: string = 'YYYY-MM-DD'): string {
  return dayjs().tz(getUserTimezone()).format(format);
}

/**
 * Gets the current time in the user's timezone
 * @param format - Optional format string (default: 'HH:mm:ss')
 * @returns Formatted time string
 * 
 * @example
 * getCurrentTime() // "14:30:45"
 * getCurrentTime('HH:mm') // "14:30"
 */
export function getCurrentTime(format: string = 'HH:mm:ss'): string {
  return dayjs().tz(getUserTimezone()).format(format);
}

/**
 * Converts a date/time from user's timezone to UTC
 * @param dateTime - Date string or Date object in user's timezone
 * @param format - Optional format string for output (default: 'YYYY-MM-DD HH:mm:ss')
 * @returns Formatted UTC date string
 * 
 * @example
 * convertToUTC('2024-01-15 14:30:00') // "2024-01-15 09:00:00" (if user is in IST)
 * convertToUTC(new Date(), 'YYYY-MM-DDTHH:mm:ss[Z]') // ISO format with Z
 */
export function convertToUTC(
  dateTime: string | Date,
  format: string = 'YYYY-MM-DD HH:mm:ss'
): string {
  const userTz = getUserTimezone();
  return dayjs(dateTime).tz(userTz).utc().format(format);
}

/**
 * Converts a UTC date/time to user's timezone
 * @param utcDateTime - UTC date string or Date object
 * @param format - Optional format string for output (default: 'YYYY-MM-DD HH:mm:ss')
 * @returns Formatted date string in user's timezone
 * 
 * @example
 * convertFromUTC('2024-01-15 09:00:00') // "2024-01-15 14:30:00" (if user is in IST)
 * convertFromUTC('2024-01-15T09:00:00Z') // "2024-01-15 14:30:00"
 */
export function convertFromUTC(
  utcDateTime: string | Date,
  format: string = 'YYYY-MM-DD HH:mm:ss'
): string {
  const userTz = getUserTimezone();
  return dayjs.utc(utcDateTime).tz(userTz).format(format);
}

/**
 * Converts a date/time from one timezone to another
 * @param dateTime - Date string or Date object
 * @param fromTimezone - Source timezone (default: user's timezone)
 * @param toTimezone - Target timezone (default: UTC)
 * @param format - Optional format string for output (default: 'YYYY-MM-DD HH:mm:ss')
 * @returns Formatted date string in target timezone
 * 
 * @example
 * convertTimezone('2024-01-15 14:30:00', 'Asia/Kolkata', 'America/New_York')
 * convertTimezone('2024-01-15 14:30:00', undefined, 'UTC')
 */
export function convertTimezone(
  dateTime: string | Date,
  fromTimezone?: string,
  toTimezone: string = 'UTC',
  format: string = 'YYYY-MM-DD HH:mm:ss'
): string {
  const fromTz = fromTimezone || getUserTimezone();
  return dayjs(dateTime).tz(fromTz).tz(toTimezone).format(format);
}

/**
 * Formats a date/time string with a custom format
 * @param dateTime - Date string or Date object
 * @param format - Format string (default: 'YYYY-MM-DD HH:mm:ss')
 * @param timezone - Optional timezone (default: user's timezone)
 * @returns Formatted date string
 * 
 * @example
 * formatDateTime('2024-01-15T14:30:00Z', 'DD/MM/YYYY HH:mm')
 * formatDateTime(new Date(), 'MMMM DD, YYYY')
 */
export function formatDateTime(
  dateTime: string | Date,
  format: string = 'YYYY-MM-DD HH:mm:ss',
  timezone?: string
): string {
  const tz = timezone || getUserTimezone();
  return dayjs(dateTime).tz(tz).format(format);
}

/**
 * Gets a dayjs object in the user's timezone
 * @param dateTime - Optional date string or Date object (default: current time)
 * @returns dayjs object in user's timezone
 */
export function getDayjsInUserTimezone(dateTime?: string | Date) {
  const userTz = getUserTimezone();
  return dateTime ? dayjs(dateTime).tz(userTz) : dayjs().tz(userTz);
}

/**
 * Gets a dayjs UTC object
 * @param dateTime - Optional date string or Date object (default: current time)
 * @returns dayjs UTC object
 */
export function getDayjsUTC(dateTime?: string | Date) {
  return dateTime ? dayjs.utc(dateTime) : dayjs.utc();
}

/**
 * Converts a date/time to ISO 8601 format in UTC
 * @param dateTime - Date string or Date object
 * @returns ISO 8601 formatted string with Z suffix
 * 
 * @example
 * toISOUTC('2024-01-15 14:30:00') // "2024-01-15T09:00:00.000Z"
 */
export function toISOUTC(dateTime: string | Date): string {
  const userTz = getUserTimezone();
  return dayjs(dateTime).tz(userTz).utc().toISOString();
}

/**
 * Parses an ISO 8601 UTC string and converts to user's timezone
 * @param isoString - ISO 8601 formatted string (e.g., "2024-01-15T09:00:00.000Z")
 * @param format - Optional format string (default: 'YYYY-MM-DD HH:mm:ss')
 * @returns Formatted date string in user's timezone
 * 
 * @example
 * fromISOUTC('2024-01-15T09:00:00.000Z') // "2024-01-15 14:30:00" (if user is in IST)
 */
export function fromISOUTC(
  isoString: string,
  format: string = 'YYYY-MM-DD HH:mm:ss'
): string {
  const userTz = getUserTimezone();
  return dayjs.utc(isoString).tz(userTz).format(format);
}

/**
 * Gets relative time from now (e.g., "2 hours ago", "in 3 days")
 * @param dateTime - Date string or Date object
 * @returns Relative time string
 * 
 * @example
 * getRelativeTime('2024-01-15 10:00:00') // "2 hours ago"
 */
export function getRelativeTime(dateTime: string | Date): string {
  const userTz = getUserTimezone();
  return dayjs(dateTime).tz(userTz).fromNow();
}

/**
 * Checks if a date is today
 * @param dateTime - Date string or Date object
 * @returns True if the date is today
 */
export function isToday(dateTime: string | Date): boolean {
  const userTz = getUserTimezone();
  const today = dayjs().tz(userTz);
  const date = dayjs(dateTime).tz(userTz);
  return today.isSame(date, 'day');
}

/**
 * Checks if a date is yesterday
 * @param dateTime - Date string or Date object
 * @returns True if the date is yesterday
 */
export function isYesterday(dateTime: string | Date): boolean {
  const userTz = getUserTimezone();
  const yesterday = dayjs().tz(userTz).subtract(1, 'day');
  const date = dayjs(dateTime).tz(userTz);
  return yesterday.isSame(date, 'day');
}

/**
 * Predefined date format constants
 */
export const DateFormats = {
  // Standard formats
  ISO: 'YYYY-MM-DD',
  ISO_DATETIME: 'YYYY-MM-DD HH:mm:ss',
  ISO_DATETIME_T: 'YYYY-MM-DDTHH:mm:ss',
  
  // Date only formats
  DD_MM_YYYY: 'DD/MM/YYYY',
  MM_DD_YYYY: 'MM/DD/YYYY',
  YYYY_MM_DD: 'YYYY-MM-DD',
  DD_MMM_YYYY: 'DD MMM YYYY',        // 14 Nov 2024
  DD_MMM_YY: 'DD MMM YY',             // 14 Nov 24
  MMM_DD_YYYY: 'MMM DD, YYYY',        // Nov 14, 2024
  MMMM_DD_YYYY: 'MMMM DD, YYYY',      // November 14, 2024
  DD_MMM: 'DD MMM',                    // 14 Nov
  MMM_YY: 'MMM YY',                    // Nov 24
  
  // Time only formats (24-hour)
  HH_MM_SS: 'HH:mm:ss',
  HH_MM: 'HH:mm',
  
  // Time only formats (12-hour)
  HH_MM_SS_12: 'hh:mm:ss A',          // 02:30:45 PM
  HH_MM_12: 'hh:mm A',                 // 02:30 PM
  H_MM_12: 'h:mm A',                   // 2:30 PM
  
  // Combined formats (24-hour)
  DD_MMM_YY_HH_MM: 'DD MMM YY, HH:mm', // 14 Nov 24, 14:30
  DD_MMM_YYYY_HH_MM: 'DD MMM YYYY, HH:mm', // 14 Nov 2024, 14:30
  DD_MM_YYYY_HH_MM: 'DD/MM/YYYY HH:mm',    // 14/11/2024 14:30
  
  // Combined formats (12-hour)
  DD_MMM_YY_HH_MM_12: 'DD MMM YY, hh:mm A', // 14 Nov 24, 02:30 PM
  DD_MMM_YYYY_HH_MM_12: 'DD MMM YYYY, hh:mm A', // 14 Nov 2024, 02:30 PM
  DD_MM_YYYY_HH_MM_12: 'DD/MM/YYYY hh:mm A',    // 14/11/2024 02:30 PM
} as const;

/**
 * Formats date in "14 Nov 25" style (DD MMM YY)
 * @param dateTime - Date string or Date object
 * @param includeTime - Whether to include time (default: false)
 * @param use12Hour - Whether to use 12-hour format (default: false)
 * @returns Formatted date string
 * 
 * @example
 * formatShortDate('2024-11-14') // "14 Nov 24"
 * formatShortDate('2024-11-14 14:30:00', true) // "14 Nov 24, 14:30"
 * formatShortDate('2024-11-14 14:30:00', true, true) // "14 Nov 24, 02:30 PM"
 */
export function formatShortDate(
  dateTime: string | Date,
  includeTime: boolean = false,
  use12Hour: boolean = false
): string {
  const userTz = getUserTimezone();
  const date = dayjs(dateTime).tz(userTz);
  
  if (includeTime) {
    return use12Hour 
      ? date.format(DateFormats.DD_MMM_YY_HH_MM_12)
      : date.format(DateFormats.DD_MMM_YY_HH_MM);
  }
  return date.format(DateFormats.DD_MMM_YY);
}

/**
 * Formats date in "14 Nov 2024" style (DD MMM YYYY)
 * @param dateTime - Date string or Date object
 * @param includeTime - Whether to include time (default: false)
 * @param use12Hour - Whether to use 12-hour format (default: false)
 * @returns Formatted date string
 * 
 * @example
 * formatMediumDate('2024-11-14') // "14 Nov 2024"
 * formatMediumDate('2024-11-14 14:30:00', true) // "14 Nov 2024, 14:30"
 * formatMediumDate('2024-11-14 14:30:00', true, true) // "14 Nov 2024, 02:30 PM"
 */
export function formatMediumDate(
  dateTime: string | Date,
  includeTime: boolean = false,
  use12Hour: boolean = false
): string {
  const userTz = getUserTimezone();
  const date = dayjs(dateTime).tz(userTz);
  
  if (includeTime) {
    return use12Hour 
      ? date.format(DateFormats.DD_MMM_YYYY_HH_MM_12)
      : date.format(DateFormats.DD_MMM_YYYY_HH_MM);
  }
  return date.format(DateFormats.DD_MMM_YYYY);
}

/**
 * Formats time in 24-hour format (HH:mm or HH:mm:ss)
 * @param dateTime - Date string or Date object
 * @param includeSeconds - Whether to include seconds (default: false)
 * @returns Formatted time string in 24-hour format
 * 
 * @example
 * formatTime24Hour('2024-11-14 14:30:00') // "14:30"
 * formatTime24Hour('2024-11-14 14:30:45', true) // "14:30:45"
 */
export function formatTime24Hour(
  dateTime: string | Date,
  includeSeconds: boolean = false
): string {
  const userTz = getUserTimezone();
  const date = dayjs(dateTime).tz(userTz);
  return date.format(includeSeconds ? DateFormats.HH_MM_SS : DateFormats.HH_MM);
}

/**
 * Formats time in 12-hour format with AM/PM (hh:mm A or hh:mm:ss A)
 * @param dateTime - Date string or Date object
 * @param includeSeconds - Whether to include seconds (default: false)
 * @param includeLeadingZero - Whether to include leading zero for hours (default: true)
 * @returns Formatted time string in 12-hour format
 * 
 * @example
 * formatTime12Hour('2024-11-14 14:30:00') // "02:30 PM"
 * formatTime12Hour('2024-11-14 14:30:45', true) // "02:30:45 PM"
 * formatTime12Hour('2024-11-14 14:30:00', false, false) // "2:30 PM"
 */
export function formatTime12Hour(
  dateTime: string | Date,
  includeSeconds: boolean = false,
  includeLeadingZero: boolean = true
): string {
  const userTz = getUserTimezone();
  const date = dayjs(dateTime).tz(userTz);
  
  if (includeSeconds) {
    return date.format(DateFormats.HH_MM_SS_12);
  }
  return date.format(includeLeadingZero ? DateFormats.HH_MM_12 : DateFormats.H_MM_12);
}

/**
 * Formats date and time with customizable format
 * @param dateTime - Date string or Date object
 * @param dateFormat - Date format style: 'short' (14 Nov 24), 'medium' (14 Nov 2024), 'long' (14 November 2024), or custom format string
 * @param timeFormat - Time format: '12h' (12-hour), '24h' (24-hour), or 'none' (no time)
 * @param includeSeconds - Whether to include seconds in time (default: false)
 * @returns Formatted date and time string
 * 
 * @example
 * formatDateTimeCustom('2024-11-14 14:30:00', 'short', '24h') // "14 Nov 24, 14:30"
 * formatDateTimeCustom('2024-11-14 14:30:00', 'medium', '12h') // "14 Nov 2024, 02:30 PM"
 * formatDateTimeCustom('2024-11-14 14:30:00', 'short', 'none') // "14 Nov 24"
 * formatDateTimeCustom('2024-11-14 14:30:00', 'DD/MM/YYYY', '24h') // "14/11/2024 14:30"
 */
export function formatDateTimeCustom(
  dateTime: string | Date,
  dateFormat: 'short' | 'medium' | 'long' | string = 'medium',
  timeFormat: '12h' | '24h' | 'none' = '24h',
  includeSeconds: boolean = false
): string {
  const userTz = getUserTimezone();
  const date = dayjs(dateTime).tz(userTz);
  
  // Determine date format
  let dateFormatStr: string;
  if (dateFormat === 'short') {
    dateFormatStr = DateFormats.DD_MMM_YY;
  } else if (dateFormat === 'medium') {
    dateFormatStr = DateFormats.DD_MMM_YYYY;
  } else if (dateFormat === 'long') {
    dateFormatStr = DateFormats.MMMM_DD_YYYY;
  } else {
    dateFormatStr = dateFormat; // Custom format
  }
  
  // Determine time format
  let timeFormatStr: string = '';
  if (timeFormat === '12h') {
    timeFormatStr = includeSeconds ? DateFormats.HH_MM_SS_12 : DateFormats.HH_MM_12;
  } else if (timeFormat === '24h') {
    timeFormatStr = includeSeconds ? DateFormats.HH_MM_SS : DateFormats.HH_MM;
  }
  
  // Combine formats
  if (timeFormatStr) {
    return date.format(`${dateFormatStr}, ${timeFormatStr}`);
  }
  return date.format(dateFormatStr);
}

/**
 * Formats date from UTC to user timezone in "14 Nov 25" style
 * @param utcDateTime - UTC date string or Date object
 * @param includeTime - Whether to include time (default: false)
 * @param use12Hour - Whether to use 12-hour format (default: false)
 * @returns Formatted date string in user's timezone
 * 
 * @example
 * formatFromUTCShort('2024-11-14T09:00:00Z') // "14 Nov 24" (if user is in IST)
 * formatFromUTCShort('2024-11-14T09:00:00Z', true, true) // "14 Nov 24, 02:30 PM"
 */
export function formatFromUTCShort(
  utcDateTime: string | Date,
  includeTime: boolean = false,
  use12Hour: boolean = false
): string {
  return formatShortDate(utcDateTime, includeTime, use12Hour);
}

/**
 * Converts date to UTC and formats it
 * @param dateTime - Date string or Date object in user's timezone
 * @param format - Optional format string (default: 'YYYY-MM-DD HH:mm:ss')
 * @returns Formatted UTC date string
 * 
 * @example
 * formatToUTC('2024-11-14 14:30:00') // "2024-11-14 09:00:00" (if user is in IST)
 * formatToUTC('2024-11-14 14:30:00', 'DD MMM YY, HH:mm') // "14 Nov 24, 09:00"
 */
export function formatToUTC(
  dateTime: string | Date,
  format: string = 'YYYY-MM-DD HH:mm:ss'
): string {
  const userTz = getUserTimezone();
  return dayjs(dateTime).tz(userTz).utc().format(format);
}

