import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';

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
    // Start the week from Sunday to match common heatmap layouts
    let currentDate = startOfWeek(startDate);

    // Ensure we include the entire range up to endDate
    while (currentDate <= endDate) {
      const week: Date[] = [];
      for (let i = 0; i < 7; i++) {
        const day = addDays(currentDate, i);
        if (day <= endDate) {
          week.push(day);
        }
      }
      // Only add the week if it contains at least one day within the date range
      if (week.length > 0) {
        weeks.push(week);
      }
      currentDate = addDays(currentDate, 7);
    }

    return weeks;
  }, [startDate, endDate]);

  const getIntensity = (date: Date) => {
    const dayData = data.find(d => isSameDay(new Date(d.date), date));
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
      'bg-gray-200 dark:bg-gray-700', // Base color for 0 reviews
      'bg-green-100 dark:bg-green-900',
      'bg-green-300 dark:bg-green-700',
      'bg-green-500 dark:bg-green-500',
      'bg-green-700 dark:bg-green-300'
    ];
    return colors[intensity] || colors[0];
  };

  const getTooltipContent = (date: Date, value: number) => {
    return `${format(date, 'MMM d, yyyy')}: ${value} reviews`;
  };

  // Get month labels for the header
  const monthLabels = useMemo(() => {
    if (weeks.length === 0) return [];

    const labels: { month: string, colSpan: number }[] = [];
    let currentColSpan = 0;
    let currentMonth = format(weeks[0][0], 'MMM');

    weeks.forEach(week => {
      week.forEach((day, dayIndex) => {
        const month = format(day, 'MMM');
        if (month !== currentMonth) {
          if (currentColSpan > 0) {
            labels.push({ month: currentMonth, colSpan: currentColSpan });
          }
          currentMonth = month;
          currentColSpan = 1;
        } else {
          currentColSpan++;
        }
        // Handle the last day
        if (weeks.indexOf(week) === weeks.length - 1 && dayIndex === week.length - 1) {
          labels.push({ month: currentMonth, colSpan: currentColSpan });
        }
      });
    });

    // Adjust colSpan to align with weeks, not individual days
    // This is a simplification, actual GitHub aligns based on the first day of the month
    // For a perfect replica, more complex logic is needed.
    // For now, we'll approximate by counting weeks.
    const simplifiedLabels: { month: string, colSpan: number }[] = [];
    let currentSimplifiedColSpan = 0;
    let currentSimplifiedMonth = format(weeks[0][0], 'MMM');
    let firstDayOfNextMonth: Date | null = null;

    weeks.forEach((week, weekIndex) => {
      const firstDayOfWeek = week[0];
      const month = format(firstDayOfWeek, 'MMM');

      if (month !== currentSimplifiedMonth) {
        if (currentSimplifiedColSpan > 0) {
          simplifiedLabels.push({ month: currentSimplifiedMonth, colSpan: currentSimplifiedColSpan });
        }
        currentSimplifiedMonth = month;
        currentSimplifiedColSpan = 1;
      } else {
        currentSimplifiedColSpan++;
      }

      // Add the last month segment after the loop finishes
      if (weekIndex === weeks.length - 1) {
        simplifiedLabels.push({ month: currentSimplifiedMonth, colSpan: currentSimplifiedColSpan });
      }

    });

    return simplifiedLabels;

  }, [weeks]);


  return (
    <div className="flex">
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
              style={{ minWidth: `${label.colSpan * (12 + 2)}px` }} // Approx width based on squares + gap
              className="text-left"
            >
              {label.month}
            </div>
          ))}
        </div>
        <div className="grid grid-flow-col grid-rows-7 gap-[2px] overflow-x-auto pb-1">
          {weeks.map((week) => (
            week.map((date) => {
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
            })
          ))}
        </div>
      </div>
    </div>
  );
} 