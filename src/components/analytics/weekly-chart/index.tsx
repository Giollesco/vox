import { View } from 'react-native';
import { WeekData } from '../utils';
import { Bar } from './single-bar';

// Map days of the week to corresponding letters
const dayLetterMap = ['n', 'p', 'u', 's', 'č', 'p', 's'];

type WeeklyChartProps = {
  data: WeekData;
  width: number;
  height: number;
};

export const WeeklyChart: React.FC<WeeklyChartProps> = ({
  width,
  height,
  data,
}) => {
  const internalPaddingHorizontal = 40;
  const gap = 3;

  return (
    <View
      style={{
        width,
        height,
        paddingHorizontal: internalPaddingHorizontal,
        gap,
        flexDirection: 'row',
        alignItems: 'flex-end',
      }}
    >
      {data &&
        data.length > 0 &&
        data.map(({ day, value }, index) => {
          // Calculate the width for each bar in the chart
          const barWidth =
            (width - internalPaddingHorizontal * 2 - gap * 6) / 7;

          // Convert 'day' (in DD.MM.YYYY format) to a Date object to extract the day of the week
          const [dayPart, monthPart, yearPart] = day.split('.').map(Number);
          const currentDate = new Date(yearPart, monthPart - 1, dayPart);
          const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, etc.

          // Get the letter corresponding to the day of the week
          const weeklyDayLetter = dayLetterMap[dayOfWeek];

          return (
            <Bar
              key={index}
              letter={weeklyDayLetter}
              maxHeight={height}
              minHeight={barWidth}
              width={barWidth}
              progress={value}
            />
          );
        })}
    </View>
  );
};
