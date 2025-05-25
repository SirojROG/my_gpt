
import { Button } from "@/components/ui/button";
import { MessageSquare, Menu, Moon, Sun, Volume2, VolumeX, Music, Image, FileText } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import MobileMenu from "./MobileMenu";

interface HeaderProps {
    onToggleSidebar: () => void;
    sidebarOpen: boolean;
    onNewChat: () => void;
    isDarkMode: boolean;
    onToggleDarkMode: () => void;
    soundEnabled: boolean;
    onToggleSound: () => void;
    musicEnabled: boolean;
    onToggleMusic: () => void;
    onBirthdayDetected: () => void;
}

const Header = ({
    onToggleSidebar,
    sidebarOpen,
    onNewChat,
    isDarkMode,
    onToggleDarkMode,
    soundEnabled,
    onToggleSound,
    musicEnabled,
    onToggleMusic,
    onBirthdayDetected
}: HeaderProps) => {
    const isMobile = useIsMobile();

    return (
        <header className="border-b py-3 px-4 flex justify-between items-center transition-colors duration-300">
            <div className="flex items-center gap-3">
                {isMobile ? (
                    <MobileMenu
                        isDarkMode={isDarkMode}
                        onToggleDarkMode={onToggleDarkMode}
                        musicEnabled={musicEnabled}
                        onToggleMusic={onToggleMusic}
                        onBirthdayDetected={onBirthdayDetected}
                    />
                ) : (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onToggleSidebar}
                        aria-label="Toggle sidebar"
                        className="animate-fade-in"
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                )}
                <div className="flex items-center gap-2">
                    <span className="text-xl font-bold gradient-text animate-pulse-slow">aGPT</span>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={onToggleMusic}
                    className={cn(
                        "transition-transform hover:scale-105",
                        musicEnabled ? "bg-accent text-accent-foreground" : ""
                    )}
                    style={{
                        marginLeft: '20px'
                    }}
                    title={musicEnabled ? "Musiqani o'chirish" : "Musiqani yoqish"}
                >
                    <Music className={cn("h-4 w-4", musicEnabled ? "text-accent-foreground" : "")} />
                </Button>

                {!isMobile && (
                    <>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={onToggleDarkMode}
                            className="transition-transform hover:scale-105"
                            title={isDarkMode ? "Yorug' rejim" : "Qorong'i rejim"}
                        >
                            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                        </Button>
                    </>
                )}
                <Button
                    onClick={onNewChat}
                    variant="outline"
                    className="flex items-center gap-2 transition-transform hover:scale-105"
                    size="sm"
                    title="Yangi suhbat"
                >
                    <MessageSquare className="h-4 w-4" />
                    <span>Yangi Suhbat</span>
                </Button>
            </div>
        </header>
    );
};

export default Header;
