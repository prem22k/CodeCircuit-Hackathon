import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import React from 'react';

interface CalendarHeatmapProps {
  data: {
    date: string;
    value: number;
  }[];
  startDate?: Date;
  endDate?: Date;
}

export function CalendarHeatmap({
  data,
  startDate = new Date(new Date().setDate(new Date().getDate() - 365)), // Default to last 365 days
  endDate = new Date(),
}: CalendarHeatmapProps) {
  const weeks = useMemo(() => {
    const weeks: Date[][] = [];
    // Start the calendar grid from the Sunday of the week containing the start date
    let currentDate = startOfWeek(startDate);

    // Generate weeks until we pass the end date
    while (currentDate <= endDate || (weeks.length > 0 && weeks[weeks.length - 1].length < 7)) {
      const week: Date[] = [];
      for (let i = 0; i < 7; i++) {
        const day = addDays(currentDate, i);
        week.push(day);
      }
      weeks.push(week);
      currentDate = addDays(currentDate, 7);

      // Stop if the last day added is after the end date and it's the end of a week
      if (week[6] >= endDate && week.length === 7) {
        break;
      }
    }

    // No need to filter weeks here, filtering will happen during rendering
    return weeks;

  }, [startDate, endDate]);

  const getIntensity = (date: Date) => {
    // Ensure date is treated as the start of the day for comparison
    const startOfDayDate = new Date(date);
    startOfDayDate.setHours(0, 0, 0, 0);

    const dayData = data.find(d => {
      const dataDate = new Date(d.date);
      dataDate.setHours(0, 0, 0, 0);
      return isSameDay(dataDate, startOfDayDate);
    });

    if (!dayData || dayData.value === 0) return 0;

    // Normalize value to 0-4 scale based on max value in the provided data
    const maxValue = Math.max(...data.map(d => d.value));
    if (maxValue === 0) return 0; // Avoid division by zero
    const intensity = Math.ceil((dayData.value / maxValue) * 4);
    return Math.min(4, intensity); // Ensure intensity is max 4
  };

  const getColor = (intensity: number) => {
    // GitHub-style green color scale
    const colors = [
      'bg-gray-100 dark:bg-gray-800', // Lightest color for 0 reviews - more visible
      'bg-green-100 dark:bg-green-900',
      'bg-green-300 dark:bg-green-700',
      'bg-green-500 dark:bg-green-500',
      'bg-green-700 dark:bg-green-300'
    ];
    return colors[intensity] || colors[0];
  };

  const getTooltipContent = (date: Date, value: number) => {
    // Ensure date is treated as the start of the day for display
    const startOfDayDate = new Date(date);
    startOfDayDate.setHours(0, 0, 0, 0);
    return `${format(startOfDayDate, 'MMM d, yyyy')}: ${value} reviews`;
  };

  // Get month labels for the header
  const monthLabels = useMemo(() => {
    if (weeks.length === 0) return [];

    const labels: { month: string, colSpan: number }[] = [];
    let currentMonth = format(weeks[0][0], 'MMM');
    let currentMonthStartIndex = 0;

    weeks.forEach((week, weekIndex) => {
      // Use the month of the first day of the week that is within the start/end date range
      const firstValidDayOfWeek = week.find(day => day >= startDate && day <= endDate);
      if (!firstValidDayOfWeek) return; // Skip weeks entirely outside the range

      const month = format(firstValidDayOfWeek, 'MMM');

      if (month !== currentMonth) {
        const numberOfWeeksInSegment = weekIndex - currentMonthStartIndex;
        if (numberOfWeeksInSegment > 0) {
          labels.push({ month: currentMonth, colSpan: numberOfWeeksInSegment });
        }
        currentMonth = month;
        currentMonthStartIndex = weekIndex;
      }

      // Add the last month segment after the loop finishes
      if (weekIndex === weeks.length - 1) {
        const numberOfWeeksInSegment = (weekIndex - currentMonthStartIndex) + 1;
        if (numberOfWeeksInSegment > 0) {
          labels.push({ month: currentMonth, colSpan: numberOfWeeksInSegment });
        }
      }
    });

    return labels;

  }, [weeks, startDate, endDate]); // Added startDate and endDate to dependencies


  return (
    <div className="flex select-none"> {/* Added select-none to prevent text selection */}
      {/* Day Labels */}
      <div className="flex flex-col mr-1 text-xs text-gray-600 dark:text-gray-400 justify-around py-2">
        <div>Mon</div>
        <div>Wed</div>
        <div>Fri</div>
      </div>
      {/* Heatmap Grid Container */}
      <div className="flex-1">
        {/* Month Labels */}
        <div className="flex text-xs text-gray-600 dark:text-gray-400 mb-1 ml-[1.5px]">
          {monthLabels.map((label, index) => (
            <div
              key={index}
              // Calculate width based on the number of weeks in the month segment
              style={{ minWidth: `${label.colSpan * (10 + 2)}px` }} // square size (10) + gap (2)
              className="text-left"
            >
              {label.month}
            </div>
          ))}
        </div>
        <div className="grid grid-flow-col grid-rows-7 gap-[2px] overflow-x-auto pb-1">
          {weeks.map((week, weekIndex) => (
            // Added weekIndex to the key for better list rendering performance
            <React.Fragment key={weekIndex}>
              {week.map((date) => {
                // Check if the day is within the specified range before rendering and applying intensity
                if (date < startDate || date > endDate) return null;

                const intensity = getIntensity(date);
                const value = data.find(d => isSameDay(new Date(d.date), date))?.value || 0;

                return (
                  <motion.div
                    key={date.toISOString()}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.1 }}
                    className={`w-[10px] h-[10px] rounded-[1px] ${
                      // Apply color based on intensity
                      getColor(intensity)
                      }`}
                    title={getTooltipContent(date, value)} // Use native title for tooltip
                  />
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
} 