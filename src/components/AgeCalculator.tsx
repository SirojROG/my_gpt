import { useState, useEffect } from 'react';
import { Calendar, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface AgeInfo {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface AgeCalculatorProps {
  onBirthdayDetected?: () => void;
}

const AgeCalculator = ({ onBirthdayDetected }: AgeCalculatorProps) => {
  const [birthDate, setBirthDate] = useState<string>(() => {
    return localStorage.getItem('birth-date') || '';
  });
  const [ageInfo, setAgeInfo] = useState<AgeInfo | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [tempBirthDate, setTempBirthDate] = useState('');
  const [birthdayChecked, setBirthdayChecked] = useState(false);

  const calculateAge = (birthDateString: string): AgeInfo => {
    const birth = new Date(birthDateString);
    const now = new Date();
    
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();
    
    if (days < 0) {
      months--;
      const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += lastMonth.getDate();
    }
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    const totalSeconds = Math.floor((now.getTime() - birth.getTime()) / 1000);
    const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    const seconds = totalSeconds % 60;
    
    return { years, months, days, hours, minutes, seconds };
  };

  const checkIfBirthday = (birthDateString: string) => {
    const birth = new Date(birthDateString);
    const today = new Date();
    
    return birth.getMonth() === today.getMonth() && birth.getDate() === today.getDate();
  };

  useEffect(() => {
    if (birthDate) {
      // Check for birthday only once per day
      if (!birthdayChecked && checkIfBirthday(birthDate)) {
        setBirthdayChecked(true);
        onBirthdayDetected?.();
      }

      const timer = setInterval(() => {
        setAgeInfo(calculateAge(birthDate));
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [birthDate, birthdayChecked, onBirthdayDetected]);

  // Reset birthday check at midnight
  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();
    
    const timeout = setTimeout(() => {
      setBirthdayChecked(false);
    }, timeUntilMidnight);

    return () => clearTimeout(timeout);
  }, []);

  const handleSave = () => {
    if (tempBirthDate) {
      setBirthDate(tempBirthDate);
      localStorage.setItem('birth-date', tempBirthDate);
      setAgeInfo(calculateAge(tempBirthDate));
      setBirthdayChecked(false); // Reset to check for birthday
    }
    setShowDialog(false);
    setTempBirthDate('');
  };

  const handleRemove = () => {
    setBirthDate('');
    setAgeInfo(null);
    setBirthdayChecked(false);
    localStorage.removeItem('birth-date');
  };

  if (!birthDate) {
    return (
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2 bg-card/80 backdrop-blur-sm border-border/50 hover:bg-accent/50"
          >
            <User className="w-4 h-4" />
            <span className="text-xs">Yosh</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tug'ilgan sanangizni kiriting</DialogTitle>
            <DialogDescription>
              Yashagan vaqtingizni real vaqtda ko'rish uchun tug'ilgan sanangizni kiriting (ixtiyoriy).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="birthdate">Tug'ilgan sana</Label>
              <Input
                id="birthdate"
                type="date"
                value={tempBirthDate}
                onChange={(e) => setTempBirthDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={!tempBirthDate} className="flex-1">
                Saqlash
              </Button>
              <Button variant="outline" onClick={() => setShowDialog(false)} className="flex-1">
                Bekor qilish
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg px-3 py-2 shadow-sm hover:shadow-md transition-all duration-300">
      <User className="w-4 h-4 text-primary" />
      <div className="flex flex-col items-center gap-1">
        <div className="text-xs text-muted-foreground font-medium leading-none">
          Yashagan vaqt
        </div>
        {ageInfo && (
          <div className="flex items-center gap-1 font-mono text-xs font-bold leading-none">
            <span className="text-primary">{ageInfo.years}y</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-primary">{ageInfo.months}m</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-primary">{ageInfo.days}d</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-accent-foreground bg-accent px-1 rounded text-xs">
              {ageInfo.hours}:{ageInfo.minutes.toString().padStart(2, '0')}:{ageInfo.seconds.toString().padStart(2, '0')}
            </span>
          </div>
        )}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleRemove}
        className="h-6 w-6 p-0 hover:bg-destructive/20"
      >
        <X className="w-3 h-3" />
      </Button>
    </div>
  );
};

export default AgeCalculator;
