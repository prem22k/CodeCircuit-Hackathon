import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { format, startOfWeek, addDays, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isWithinInterval } from 'date-fns';
import { cs } from 'date-fns/locale';

interface CalendarHeatmapProps {
  data: {
    date: string;
    value: number;
  }[];
  startDate?: Date;
  endDate?: Date;
  colorScheme?: string[]; // Optional prop for custom color scheme
}

const defaultColorScheme = [
  'bg-gray-200 dark:bg-gray-700', // Level 0 (No activity)
  'bg-green-300 dark:bg-green-700', // Level 1
  'bg-green-400 dark:bg-green-600', // Level 2
  'bg-green-500 dark:bg-green-500', // Level 3
  'bg-green-600 dark:bg-green-400', // Level 4
];

const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function CalendarHeatmap({
  data,
  startDate = new Date(new Date().setDate(new Date().getDate() - 365)), // Last 365 days
  endDate = new Date(),
  colorScheme = defaultColorScheme,
}: CalendarHeatmapProps) {
  const activityData = useMemo(() => {
    const map = new Map<string, number>();
    data.forEach(item => {
      // Use a simple YYYY-MM-DD format for consistent mapping
      const formattedDate = format(new Date(item.date), 'yyyy-MM-dd');
      map.set(formattedDate, item.value);
    });
    return map;
  }, [data]);

  const allDates = useMemo(() => {
    // Ensure all days in the range are included
    return eachDayOfInterval({ start: startOfWeek(startDate), end: endDate });
  }, [startDate, endDate]);

  const weeks = useMemo(() => {
    const weeks: Date[][] = [];
    let currentWeek: Date[] = [];

    // Add leading empty days for the first week if startDate is not a Sunday
    const firstDayOfWeek = getDay(startOfWeek(startDate));
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push(new Date(0)); // Use a dummy date or null for empty spots
    }

    allDates.forEach(date => {
      currentWeek.push(date);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });

    // Add trailing empty days for the last week if endDate is not a Saturday
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(new Date(0)); // Use a dummy date or null for empty spots
      }
      weeks.push(currentWeek);
    }

    return weeks;
  }, [allDates, startDate]);

  const getMaxActivityValue = useMemo(() => {
    return Math.max(1, ...Array.from(activityData.values())); // Ensure max is at least 1
  }, [activityData]);

  const getIntensity = (date: Date): number => {
    if (date.getTime() === 0) return -1; // Indicator for empty spot

    // Check if the date is within the actual data range, not just the calendar grid range
    if (!isWithinInterval(date, { start: startDate, end: endDate })) {
      return -1; // Also treat dates outside the specified range as empty/inactive
    }

    const formattedDate = format(date, 'yyyy-MM-dd');
    const value = activityData.get(formattedDate) || 0;

    if (value === 0) return 0; // Level 0 for zero activity

    // Normalize value to 1-4 scale for activity levels
    const intensity = Math.ceil((value / getMaxActivityValue) * 4);
    return Math.max(1, Math.min(4, intensity)); // Ensure intensity is between 1 and 4 for active days
  };

  const getColor = (intensity: number): string => {
    if (intensity === -1) {
      return 'bg-transparent'; // Transparent for empty spots
    }
    return colorScheme[intensity];
  };

  // Calculate month positions for labels
  const monthPositions = useMemo(() => {
    const positions: { month: string; column: number; span: number }[] = [];
    let currentMonth = -1;
    let startColumn = -1;
    let span = 0;

    weeks.forEach((week, weekIndex) => {
      week.forEach((date, dayIndex) => {
        if (date.getTime() === 0) return; // Skip dummy dates
        const month = date.getMonth();
        if (month !== currentMonth) {
          if (currentMonth !== -1) {
            positions.push({ month: monthLabels[currentMonth], column: startColumn, span });
          }
          currentMonth = month;
          startColumn = weekIndex;
          span = 1;
        } else {
          span++;
        }
      });
    });

    // Push the last month
    if (currentMonth !== -1) {
      positions.push({ month: monthLabels[currentMonth], column: startColumn, span });
    }

    return positions;
  }, [weeks]);


  return (
    <div className="overflow-x-auto p-2">
      <div className="min-w-[800px] lg:min-w-full">
        {/* Month Labels */}
        <div className="grid gap-1 mb-1"
          style={{ gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))` }}
        >
           {monthPositions.map(({ month, column, span }) => (
            <div
              key={month + column}
              className="text-left text-sm text-gray-600 dark:text-gray-400 px-1"
              style={{ gridColumn: `${column + 1} / span ${span}` }}
            >
              {month}
            </div>
          ))}
        </div>

        {/* Weekday Labels and Heatmap */}
        <div className="flex">
          {/* Day Labels (Vertical) */}
          <div className="grid grid-rows-7 gap-1 mr-1">
            {dayLabels.map(day => (
              <div key={day} className="text-right text-xs text-gray-600 dark:text-gray-400 h-4 leading-4">
                {day}
              </div>
            ))}
          </div>

          {/* Heatmap Grid */}
          <div
            className="grid gap-1 flex-1"
            style={{ gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))` }}
          >
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-rows-7 gap-1">
                {week.map((date, dayIndex) => {
                  const intensity = getIntensity(date);
                  const dateString = date.getTime() === 0 ? '' : format(date, 'MMM d, yyyy');
                  const title = intensity === -1 ? '' : `${dateString}: ${activityData.get(format(date, 'yyyy-MM-dd')) || 0} reviews`;

                  return (
                    <motion.div
                      key={date.toISOString()}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: (weekIndex * 7 + dayIndex) * 0.005 }}
                      className={`aspect-square rounded-sm transition-colors ${getColor(intensity)} ${intensity !== -1 ? 'hover:shadow-md' : ''}`}
                      title={title}
                      // Only allow interaction/cursor change for non-empty squares
                      style={{ cursor: intensity !== -1 ? 'pointer' : 'default' }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-end text-sm text-gray-600 dark:text-gray-400">
          Less
          <div className="flex ml-2 space-x-1">
            {colorScheme.map((colorClass, index) => (
              <div
                key={colorClass}
                className={`w-4 h-4 rounded-sm ${colorClass}`}
                title={
                  index === 0
                    ? 'No activity'
                    : `${index} ${index === 4 ? '(Most)' : ''} Activity`
                }
              />
            ))}
          </div>
          More
        </div>

      </div>
    </div>
  );
} 