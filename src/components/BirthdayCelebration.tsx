
import { useState, useEffect } from 'react';
import { PartyPopper, Gift, Cake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface BirthdayCelebrationProps {
  isVisible: boolean;
  onClose: () => void;
}

const BirthdayCelebration = ({ isVisible, onClose }: BirthdayCelebrationProps) => {
  const [showFireworks, setShowFireworks] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowFireworks(true);
      const timer = setTimeout(() => setShowFireworks(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  return (
    <>
      {/* Fireworks Animation Overlay */}
      {showFireworks && (
        <div className="fixed inset-0 z-[60] pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-pink-500/20 to-purple-600/20 animate-pulse">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random()}s`
                }}
              />
            ))}
          </div>
        </div>
      )}

      <Dialog open={isVisible} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md bg-gradient-to-br from-yellow-50 to-pink-50 dark:from-yellow-950/50 dark:to-pink-950/50 border-2 border-yellow-300 dark:border-yellow-600">
          <DialogHeader className="text-center">
            <div className="flex justify-center mb-4 space-x-2">
              <PartyPopper className="w-8 h-8 text-yellow-500 animate-bounce" />
              <Cake className="w-8 h-8 text-pink-500 animate-pulse" />
              <Gift className="w-8 h-8 text-purple-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-pink-600 bg-clip-text text-transparent">
              🎉 Tug'ilgan kuningiz muborak! 🎉
            </DialogTitle>
            <DialogDescription className="text-lg mt-4 space-y-2">
              <p className="text-center">Sizga baxt, sog'lik va omad tilaymiz!</p>
              <p className="text-center">Barcha orzularingiz amalga oshsin! 🌟</p>
              <div className="flex justify-center mt-4">
                <div className="text-4xl animate-bounce">🎂🎈🎁</div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-6">
            <Button 
              onClick={onClose}
              className="bg-gradient-to-r from-yellow-500 to-pink-500 hover:from-yellow-600 hover:to-pink-600 text-white font-bold"
            >
              Rahmat! 💝
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BirthdayCelebration;
