
import {useEffect, useState} from "react";
import {cn} from "@/lib/utils";

interface LoadingScreenProps {
    onLoadingComplete?: () => void;
}

const LoadingScreen = ({onLoadingComplete}: LoadingScreenProps) => {
    const [progress, setProgress] = useState(0);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setFadeOut(true);
                    setTimeout(() => {
                        onLoadingComplete?.();
                    }, 500);
                    return 100;
                }
                return prev + 2;
            });
        }, 50);

        return () => clearInterval(interval);
    }, [onLoadingComplete]);

    return (
        <div className={cn(
            "fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-accent/20",
            "transition-opacity duration-500",
            fadeOut ? "opacity-0" : "opacity-100"
        )}>
            <div className="flex flex-col items-center justify-center space-y-8">
                {/* aGPT Logo with Animation */}
                <div className="relative">
                    <div className={cn(
                        "w-32 h-32 rounded-full bg-gradient-to-r from-primary to-accent",
                        "flex items-center justify-center shadow-2xl",
                        "animate-pulse"
                    )}>
                        <span className="text-4xl font-bold text-white animate-bounce">
                            aGPT
                        </span>
                    </div>
                    
                    {/* Rotating Ring */}
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin"></div>
                    <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-accent animate-spin animate-reverse"></div>
                </div>

                {/* Loading Text */}
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold gradient-text animate-pulse">
                        aGPT yuklanmoqda...
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Ilg'or AI yordamchingiz tayyorlanmoqda
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="w-64 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300 ease-out"
                        style={{width: `${progress}%`}}
                    ></div>
                </div>

                {/* Progress Percentage */}
                <div className="text-sm text-muted-foreground">
                    {progress}%
                </div>

                {/* Floating Particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className={cn(
                                "absolute w-2 h-2 bg-primary/30 rounded-full",
                                "animate-bounce"
                            )}
                            style={{
                                left: `${20 + i * 15}%`,
                                top: `${30 + (i % 2) * 40}%`,
                                animationDelay: `${i * 0.2}s`,
                                animationDuration: '2s'
                            }}
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;
