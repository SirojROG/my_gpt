
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';

const RealTimeClock = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (date: Date) => {
        return {
            hours: date.getHours().toString().padStart(2, '0'),
            minutes: date.getMinutes().toString().padStart(2, '0'),
            seconds: date.getSeconds().toString().padStart(2, '0'),
            day: date.getDate().toString().padStart(2, '0'),
            month: (date.getMonth() + 1).toString().padStart(2, '0'),
            year: date.getFullYear().toString(),
        };
    };

    const { hours, minutes, seconds, day, month, year } = formatTime(time);

    return (
        <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg px-3 py-2 shadow-sm hover:shadow-md transition-all duration-300">
            <Clock className="w-4 h-4 text-primary animate-pulse" />
            <div className="flex flex-col items-center gap-1">
                {/* Date */}
                <div className="text-xs text-muted-foreground font-medium leading-none">
                    {day}.{month}.{year}
                </div>
                
                {/* Time */}
                <div className="flex items-center gap-1 font-mono text-sm font-bold leading-none">
                    <span className="text-primary">{hours}</span>
                    <span className="text-muted-foreground animate-pulse">:</span>
                    <span className="text-primary">{minutes}</span>
                    <span className="text-muted-foreground animate-pulse">:</span>
                    <span className="text-accent-foreground bg-accent px-1 rounded text-xs">{seconds}</span>
                </div>
            </div>
        </div>
    );
};

export default RealTimeClock;
