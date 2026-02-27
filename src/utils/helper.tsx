type DateFormat = 'yyyy-mm-dd' | 'yy-mm-dd' | 'mm/dd/yy' | 'mm/dd/yyyy';

export const convertDateTime = (
  date: string,
  format: DateFormat = 'yyyy-mm-dd'
): string => {
  const newDate = new Date(date);

  const month = (newDate.getMonth() + 1).toString().padStart(2, '0');
  const day = newDate.getDate().toString().padStart(2, '0');
  const fullYear = newDate.getFullYear().toString();
  const shortYear = fullYear.slice(-2);

  switch (format) {
    case 'yyyy-mm-dd':
      return `${fullYear}-${month}-${day}`;
    case 'yy-mm-dd':
      return `${shortYear}-${month}-${day}`;
    case 'mm/dd/yyyy':
      return `${month}/${day}/${fullYear}`;
    case 'mm/dd/yy':
      return `${month}/${day}/${shortYear}`;
    default:
      return `${fullYear}-${month}-${day}`;
  }
};

// Usage examples:
// convertDateTime("2026-02-17T07:00:27.345Z") → "2026-02-17"
// convertDateTime("2026-02-17T07:00:27.345Z", 'yy-mm-dd') → "26-02-17"
// convertDateTime("2026-02-17T07:00:27.345Z", 'mm/dd/yyyy') → "02/17/2026"