
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { 
  Menu, 
  Calculator, 
  Clock, 
  Sparkles, 
  Mic, 
  Volume2, 
  Moon, 
  Sun, 
  Music,
  Cake,
  Image,
  FileText
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import AgeCalculator from './AgeCalculator';
import RealTimeClock from './RealTimeClock';
import EngagingFeatures from './EngagingFeatures';
import VoiceAssistant from './VoiceAssistant';
import ImageGenerator from './ImageGenerator';
import ImageAnalyzer from './ImageAnalyzer';

interface MobileMenuProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  musicEnabled: boolean;
  onToggleMusic: () => void;
  onBirthdayDetected: () => void;
}

const MobileMenu = ({ 
  isDarkMode, 
  onToggleDarkMode, 
  musicEnabled, 
  onToggleMusic,
  onBirthdayDetected 
}: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  const menuItems = [
    {
      icon: Calculator,
      label: "Yosh Kalkulyatori",
      component: <AgeCalculator onBirthdayDetected={onBirthdayDetected} />,
      color: "text-blue-500"
    },
    {
      icon: Clock,
      label: "Haqiqiy Vaqt",
      component: <RealTimeClock />,
      color: "text-green-500"
    },
    {
      icon: Sparkles,
      label: "Qiziqarli Funksiyalar",
      component: <EngagingFeatures />,
      color: "text-purple-500"
    },
    {
      icon: Mic,
      label: "Ovozli Yordamchi",
      component: <VoiceAssistant />,
      color: "text-red-500"
    },
    {
      icon: Image,
      label: "Rasm Yaratish",
      component: <ImageGenerator />,
      color: "text-orange-500"
    },
    {
      icon: FileText,
      label: "Rasm Tahlili",
      component: <ImageAnalyzer />,
      color: "text-cyan-500"
    }
  ];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Menu className="h-6 w-6 transition-transform group-hover:scale-110" />
        </Button>
      </SheetTrigger>
      
      <SheetContent side="left" className="w-80 bg-gradient-to-b from-background to-accent/10 p-0">
        <SheetHeader className="p-6 pb-4">
          <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            aGPT Menyu
          </SheetTitle>
          <div className="h-px bg-gradient-to-r from-blue-500 to-purple-500 opacity-30" />
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-120px)] px-6">
          <div className="space-y-4">
            {/* Settings Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Sozlamalar
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onToggleDarkMode}
                  className="flex items-center gap-2 justify-start h-12"
                >
                  {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  <span className="text-xs">{isDarkMode ? "Yorug'" : "Qorong'i"}</span>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onToggleMusic}
                  className={`flex items-center gap-2 justify-start h-12 ${
                    musicEnabled ? "bg-accent text-accent-foreground" : ""
                  }`}
                >
                  <Music className="h-4 w-4" />
                  <span className="text-xs">Musiqa</span>
                </Button>
              </div>
            </div>

            {/* Features Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Funksiyalar
              </h3>
              <div className="space-y-3">
                {menuItems.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 rounded-full bg-accent/30 ${item.color}`}>
                        <item.icon className="h-4 w-4" />
                      </div>
                      <span className="font-medium text-sm">{item.label}</span>
                    </div>
                    <div className="pl-1">
                      {item.component}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Cake className="h-4 w-4 text-pink-500" />
                  <span className="text-xs text-muted-foreground">
                    A'lamov Asadbek tomonidan yaratildi
                  </span>
                </div>
                <div className="text-xs text-muted-foreground opacity-60">
                  Mobil versiya 2024
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
