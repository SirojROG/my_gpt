
import { useState, useEffect } from 'react';

const DynamicBackground = () => {
  const [timeOfDay, setTimeOfDay] = useState<'sunrise' | 'day' | 'sunset' | 'night'>('day');

  useEffect(() => {
    const updateTimeOfDay = () => {
      const hour = new Date().getHours();
      
      if (hour >= 5 && hour < 8) {
        setTimeOfDay('sunrise');
      } else if (hour >= 8 && hour < 17) {
        setTimeOfDay('day');
      } else if (hour >= 17 && hour < 20) {
        setTimeOfDay('sunset');
      } else {
        setTimeOfDay('night');
      }
    };

    updateTimeOfDay();
    const interval = setInterval(updateTimeOfDay, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const getBackgroundClass = () => {
    switch (timeOfDay) {
      case 'sunrise':
        return 'bg-gradient-to-br from-orange-200 via-yellow-100 to-pink-200 dark:from-orange-900/20 dark:via-yellow-900/20 dark:to-pink-900/20';
      case 'day':
        return 'bg-gradient-to-br from-blue-100 via-sky-50 to-indigo-100 dark:from-blue-900/20 dark:via-sky-900/20 dark:to-indigo-900/20';
      case 'sunset':
        return 'bg-gradient-to-br from-orange-300 via-red-200 to-purple-200 dark:from-orange-900/30 dark:via-red-900/20 dark:to-purple-900/20';
      case 'night':
        return 'bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 dark:from-indigo-950 dark:via-purple-950 dark:to-blue-950';
      default:
        return '';
    }
  };

  return (
    <div 
      className={`fixed inset-0 -z-10 transition-all duration-1000 ${getBackgroundClass()}`}
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
    </div>
  );
};

export default DynamicBackground;
