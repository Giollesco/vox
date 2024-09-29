export type Timestamp = {
  day: string;
  value: number;
};

export type WeekData = Timestamp[];

export type ChartData = WeekData[];

// Helper function to format date into DD.MM.YYYY
const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

export const getWeeksData = (triggeredDates: string[]): ChartData | null => {
  // If triggered dates are empty, return null
  if (triggeredDates.length === 0) {
    return null;
  }

  // Helper function to parse DD.MM.YYYY format into Date objects
  const parseDate = (dateString: string): Date => {
    const [day, month, year] = dateString.split('.').map(Number);
    return new Date(year, month - 1, day); // Months are 0-indexed
  };

  // Parse triggered dates from DD.MM.YYYY format to Date objects
  const dates = triggeredDates.map(parseDate);

  // Ensure dates are valid and not empty
  if (dates.length === 0) {
    return null; // If there are no valid dates, return null
  }

  // Find the earliest date and get the first day of the week (Monday)
  const firstDate = dates.reduce(
    (earliest, current) => (current < earliest ? current : earliest),
    dates[0]
  );
  const startOfWeek = new Date(firstDate);
  startOfWeek.setDate(firstDate.getDate() - (firstDate.getDay() || 7) + 1); // Adjust to the previous Monday

  // Get current date
  const currentDate = new Date();
  let endOfWeek = new Date(currentDate);

  // If today is Sunday, set endOfWeek to today (i.e., do not go to next week)
  if (currentDate.getDay() === 0) {
    endOfWeek = currentDate;
  } else {
    // Otherwise, set endOfWeek to the upcoming Sunday
    endOfWeek.setDate(currentDate.getDate() + (6 - currentDate.getDay())); // Adjust to next Sunday
  }

  const weeks: ChartData = [];
  let currentWeekStart = new Date(startOfWeek);

  while (currentWeekStart <= endOfWeek) {
    const weekData: WeekData = [];
    for (let i = 0; i < 7; i++) {
      // Create 7 days for the week
      const currentDay = new Date(currentWeekStart);
      currentDay.setDate(currentWeekStart.getDate() + i);

      // Check if the current day matches any of the triggered dates
      const isCompleted = dates.some(
        (date) => formatDate(date) === formatDate(currentDay)
      );

      weekData.push({
        day: formatDate(currentDay), // Format date as DD.MM.YYYY
        value: isCompleted ? 1 : 0,
      });
    }
    weeks.push(weekData);
    currentWeekStart.setDate(currentWeekStart.getDate() + 7); // Move to the next week
  }

  return weeks;
};
