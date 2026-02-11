/**
 * Format date to mm-dd-yyyy format
 * @param date - Date object, string, or timestamp
 * @returns Formatted date string in mm-dd-yyyy format
 */
export function formatDateMMDDYYYY(date: Date | string | number): string {
  try {
    const dateObj = new Date(date);

    if (isNaN(dateObj.getTime())) {
      return "Invalid date";
    }

    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const year = dateObj.getFullYear();

    return `${month}-${day}-${year}`;
  } catch (error) {
    return "Invalid date";
  }
}

/**
 * Format date to mm/dd/yyyy format (alternative format with slashes)
 * @param date - Date object, string, or timestamp
 * @returns Formatted date string in mm/dd/yyyy format
 */
export function formatDateMMDDYYYYWithSlash(
  date: Date | string | number
): string {
  try {
    const dateObj = new Date(date);

    if (isNaN(dateObj.getTime())) {
      return "Invalid date";
    }

    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const year = dateObj.getFullYear();

    return `${month}/${day}/${year}`;
  } catch (error) {
    return "Invalid date";
  }
}
