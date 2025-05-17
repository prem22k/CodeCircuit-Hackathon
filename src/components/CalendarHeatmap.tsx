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
  startDate = new Date(new Date().setDate(new Date().getDate() - 90)), // Last 90 days
  endDate = new Date()
}: CalendarHeatmapProps) {
  const weeks = useMemo(() => {
    const weeks: Date[][] = [];
    let currentDate = startOfWeek(startDate);
    
    while (currentDate <= endDate) {
      const week: Date[] = [];
      for (let i = 0; i < 7; i++) {
        week.push(addDays(currentDate, i));
      }
      weeks.push(week);
      currentDate = addDays(currentDate, 7);
    }
    
    return weeks;
  }, [startDate, endDate]);

  const getIntensity = (date: Date) => {
    const dayData = data.find(d => isSameDay(new Date(d.date), date));
    if (!dayData) return 0;
    
    // Normalize value to 0-4 scale
    const maxValue = Math.max(...data.map(d => d.value));
    return Math.min(4, Math.ceil((dayData.value / maxValue) * 4));
  };

  const getColor = (intensity: number) => {
    const colors = [
      'bg-gray-100 dark:bg-gray-800',
      'bg-primary-100 dark:bg-primary-900',
      'bg-primary-200 dark:bg-primary-800',
      'bg-primary-300 dark:bg-primary-700',
      'bg-primary-400 dark:bg-primary-600'
    ];
    return colors[intensity];
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm text-gray-600 dark:text-gray-400">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {weeks.map((week, weekIndex) => (
            week.map((date, dayIndex) => {
              const intensity = getIntensity(date);
              return (
                <motion.div
                  key={date.toISOString()}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (weekIndex * 7 + dayIndex) * 0.01 }}
                  className={`aspect-square rounded-sm ${getColor(intensity)}`}
                  title={`${format(date, 'MMM d, yyyy')}: ${intensity} reviews`}
                />
              );
            })
          ))}
        </div>
      </div>
    </div>
  );
} 