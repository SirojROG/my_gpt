
import { useState, useEffect, useRef } from "react";
import ChatInput from "@/components/ChatInput";
import ChatMessage from "@/components/ChatMessage";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import HelpDialog from "@/components/HelpDialog";
import QRCodeGenerator from "@/components/QRCodeGenerator";
import LoadingScreen from "@/components/LoadingScreen";
import RealTimeClock from "@/components/RealTimeClock";
import EngagingFeatures from "@/components/EngagingFeatures";
import AgeCalculator from "@/components/AgeCalculator";
import BirthdayCelebration from "@/components/BirthdayCelebration";
import DynamicBackground from "@/components/DynamicBackground";
import VoiceAssistant from "@/components/VoiceAssistant";
import ImageGenerator from "@/components/ImageGenerator";
import ImageAnalyzer from "@/components/ImageAnalyzer";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Message, ChatSession } from "@/types/chat";
import { generateResponse } from "@/utils/ai";
import { createAudio, playAudio, pauseAudio, setAudioVolume } from "@/utils/audio";

// Audio file URLs - Updated for Vercel compatibility
const MESSAGE_SOUND_URL = "/message-sound.mp3";
const BACKGROUND_MUSIC_URL = "/background-music.mp3";

const Index = () => {
    // Call useIsMobile at the top level of the component
    const isMobile = useIsMobile();

    const [isLoading, setIsLoading] = useState(false);
    const [isAppLoading, setIsAppLoading] = useState(true);
    const [messages, setMessages] = useState<Message[]>([]);
    const [sessions, setSessions] = useState<ChatSession[]>(() => {
        const saved = localStorage.getItem("chat-sessions");
        return saved ? JSON.parse(saved) : [];
    });
    const [currentSessionId, setCurrentSessionId] = useState<string>(() => {
        return localStorage.getItem("current-session-id") || "";
    });

    const [sidebarOpen, setSidebarOpen] = useState(() => !isMobile && window.innerWidth > 768);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem("dark-mode");
        return saved ? JSON.parse(saved) : window.matchMedia("(prefers-color-scheme: dark)").matches;
    });
    const [soundEnabled, setSoundEnabled] = useState(() => {
        const saved = localStorage.getItem("sound-enabled");
        return saved ? JSON.parse(saved) : true;
    });
    const [musicEnabled, setMusicEnabled] = useState(() => {
        const saved = localStorage.getItem("music-enabled");
        return saved ? JSON.parse(saved) : true;
    });
    const [showBirthdayCelebration, setShowBirthdayCelebration] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messageSound = useRef<HTMLAudioElement | null>(null);
    const backgroundMusic = useRef<HTMLAudioElement | null>(null);
    const audioInitialized = useRef<boolean>(false);
    const { toast } = useToast();

    // Initialize audio on component mount with improved handling
    useEffect(() => {
        const initAudio = async () => {
            if (audioInitialized.current) return;

            try {
                // Initialize message sound
                messageSound.current = await createAudio(MESSAGE_SOUND_URL, 0.5, false);

                // Initialize background music
                backgroundMusic.current = await createAudio(BACKGROUND_MUSIC_URL, 0.3, true);

                if (musicEnabled && backgroundMusic.current) {
                    // Try to play background music (might be blocked by browser)
                    const playResult = await playAudio(backgroundMusic.current);
                    if (!playResult) {
                        console.log("Background music was blocked. User interaction needed.");
                    }
                }

                audioInitialized.current = true;
            } catch (e) {
                console.error("Error initializing audio:", e);
            }
        };

        initAudio();

        // Add event listeners for user interaction to enable audio
        const enableAudioOnInteraction = async () => {
            if (!audioInitialized.current) {
                await initAudio();
            } else if (musicEnabled && backgroundMusic.current?.paused) {
                await playAudio(backgroundMusic.current);
            }

            // Remove event listeners after first interaction
            document.removeEventListener('click', enableAudioOnInteraction);
            document.removeEventListener('touchstart', enableAudioOnInteraction);
            document.removeEventListener('keydown', enableAudioOnInteraction);
        };

        document.addEventListener('click', enableAudioOnInteraction);
        document.addEventListener('touchstart', enableAudioOnInteraction);
        document.addEventListener('keydown', enableAudioOnInteraction);

        return () => {
            document.removeEventListener('click', enableAudioOnInteraction);
            document.removeEventListener('touchstart', enableAudioOnInteraction);
            document.removeEventListener('keydown', enableAudioOnInteraction);
        }
    }, [musicEnabled]);

    // Effect to manage background music state
    useEffect(() => {
        const handleMusic = async () => {
            if (backgroundMusic.current) {
                if (musicEnabled && backgroundMusic.current.paused) {
                    await playAudio(backgroundMusic.current);
                } else if (!musicEnabled && !backgroundMusic.current.paused) {
                    pauseAudio(backgroundMusic.current);
                }
            }
        };

        if (audioInitialized.current) {
            handleMusic();
        }

        localStorage.setItem("music-enabled", JSON.stringify(musicEnabled));
    }, [musicEnabled]);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("dark-mode", JSON.stringify(isDarkMode));
    }, [isDarkMode]);

    useEffect(() => {
        localStorage.setItem("sound-enabled", JSON.stringify(soundEnabled));
    }, [soundEnabled]);

    useEffect(() => {
        if (currentSessionId) {
            localStorage.setItem("current-session-id", currentSessionId);
            const session = sessions.find(s => s.id === currentSessionId);
            if (session) {
                setMessages(session.messages);
            }
        }
    }, [currentSessionId, sessions]);

    useEffect(() => {
        localStorage.setItem("chat-sessions", JSON.stringify(sessions));
    }, [sessions]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
    };

    const playMessageSound = async () => {
        if (soundEnabled && messageSound.current) {
            messageSound.current.currentTime = 0;
            await playAudio(messageSound.current);
        }
    };

    const toggleSound = () => {
        setSoundEnabled(prev => !prev);
        toast({
            title: soundEnabled ? "Ovoz o'chirildi" : "Ovoz yoqildi",
            duration: 2000,
        });
    };

    const toggleMusic = () => {
        setMusicEnabled(prev => !prev);
        toast({
            title: musicEnabled ? "Musiqa o'chirildi" : "Musiqa yoqildi",
            duration: 2000,
        });
    };

    const handleBirthdayDetected = () => {
        setShowBirthdayCelebration(true);
    };

    const handleSendMessage = async (content: string) => {
        if (!content.trim()) return;

        if (!import.meta.env.VITE_GEMINI_API_KEY) {
            toast({
                title: "Xatolik. Adminstratorga murojaat qiling.",
                description: "Xatolik yuzaga keldi. Iltimos, administratorga murojaat qiling.",
                variant: "destructive",
            });
            return;
        }

        // Create or update session with improved handling
        const userMessage: Message = {role: "user", content, timestamp: new Date().toISOString()};
        let sessionId = currentSessionId;
        let updatedMessages = [...messages, userMessage];

        if (!sessionId) {
            // Create new session with a better title extraction
            sessionId = Date.now().toString();
            // Get first few words for the title, max 30 chars
            const titleText = content.split(/\s+/).slice(0, 5).join(" ");
            const newSession: ChatSession = {
                id: sessionId,
                title: titleText.slice(0, 30) + (titleText.length > 30 ? "..." : ""),
                createdAt: new Date().toISOString(),
                messages: updatedMessages,
            };
            setSessions(prev => [newSession, ...prev]);
            setCurrentSessionId(sessionId);
        } else {
            // Update existing session
            setSessions(prev =>
                prev.map(session =>
                    session.id === sessionId
                        ? {...session, messages: updatedMessages}
                        : session
                )
            );
        }

        setMessages(updatedMessages);
        setIsLoading(true);
        await playMessageSound();

        try {
            const aiResponse = await generateResponse(content);
            const assistantMessage: Message = {
                role: "assistant",
                content: aiResponse,
                timestamp: new Date().toISOString()
            };

            updatedMessages = [...updatedMessages, assistantMessage];
            setMessages(updatedMessages);
            await playMessageSound();

            // Update session with AI response and ensure it's saved
            setSessions(prev =>
                prev.map(session =>
                    session.id === sessionId
                        ? {...session, messages: updatedMessages}
                        : session
                )
            );
        } catch (error) {
            console.error("Failed to generate response:", error);

            let errorMessage = "Javob yaratishda xatolik yuz berdi.";
            if (error instanceof Error) {
                errorMessage = error.message;
            }

            toast({
                title: "Xatolik",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const createNewSession = () => {
        setCurrentSessionId("");
        setMessages([]);
        setSidebarOpen(false);
    };

    const selectSession = (sessionId: string) => {
        setCurrentSessionId(sessionId);
        const session = sessions.find(s => s.id === sessionId);
        if (session) {
            setMessages(session.messages);
        }
        if (isMobile) {
            setSidebarOpen(false);
        }
    };

    const deleteSession = (sessionId: string) => {
        setSessions(prev => prev.filter(s => s.id !== sessionId));
        if (currentSessionId === sessionId) {
            setCurrentSessionId("");
            setMessages([]);
        }
    };

    const toggleSidebar = () => {
        setSidebarOpen(prev => !prev);
    };

    const toggleDarkMode = () => {
        setIsDarkMode(prev => !prev);
    };

    if (isAppLoading) {
        return <LoadingScreen onLoadingComplete={() => setIsAppLoading(false)} />;
    }

    return (
        <div className={`flex h-screen overflow-hidden bg-background transition-colors duration-300 font-poppins relative`}>
            <DynamicBackground />
            <BirthdayCelebration 
                isVisible={showBirthdayCelebration} 
                onClose={() => setShowBirthdayCelebration(false)} 
            />
            
            <Sidebar
                open={sidebarOpen}
                sessions={sessions}
                currentSessionId={currentSessionId}
                onSelectSession={selectSession}
                onCreateNewSession={createNewSession}
                onDeleteSession={deleteSession}
                isDarkMode={isDarkMode}
                onToggleDarkMode={toggleDarkMode}
            />

            <div className="flex flex-col flex-1 h-full overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b">
                    <Header
                        onToggleSidebar={toggleSidebar}
                        sidebarOpen={sidebarOpen}
                        onNewChat={createNewSession}
                        isDarkMode={isDarkMode}
                        onToggleDarkMode={toggleDarkMode}
                        soundEnabled={soundEnabled}
                        onToggleSound={toggleSound}
                        musicEnabled={musicEnabled}
                        onToggleMusic={toggleMusic}
                        onBirthdayDetected={handleBirthdayDetected}
                    />
                    <div className="flex items-center gap-3">
                        {!isMobile && (
                            <>
                                <AgeCalculator onBirthdayDetected={handleBirthdayDetected} />
                                <RealTimeClock />
                            </>
                        )}
                        <HelpDialog/>
                    </div>
                </div>

                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-start min-h-full text-center animate-fade-in space-y-8 pt-8">
                            <div
                                className="w-28 h-20 rounded-full bg-accent flex items-center justify-center mb-6 animate-pulse-slow">
                                <span className="text-4xl gradient-text font-bold">aGPT</span>
                            </div>
                            <h1 className="text-3xl font-bold mb-2 gradient-text">aGPTga xush kelibsiz</h1>
                            <p className="text-muted-foreground mb-8 max-w-md">
                                Abdullayev Sirojiddin tomonidan yaratilgan ilg'or AI yordamchi. Mendan xohlagan narsani
                                so'rashingiz mumkin!
                            </p>

                            {/* Desktop features grid - improved layout */}
                            {!isMobile && (
                                <div className="w-full max-w-6xl mb-8">
                                    <h2 className="text-2xl font-bold gradient-text mb-6">AI Funksiyalar</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="p-6 border rounded-xl bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                                            <div className="text-center space-y-4">
                                                <div className="w-12 h-12 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                                    <span className="text-white text-xl">🎤</span>
                                                </div>
                                                <h3 className="font-semibold text-lg">Ovozli Yordamchi</h3>
                                                <p className="text-sm text-muted-foreground mb-4">Ovoz orqali muloqot qiling</p>
                                                <VoiceAssistant />
                                            </div>
                                        </div>
                                        
                                        <div className="p-6 border rounded-xl bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                                            <div className="text-center space-y-4">
                                                <div className="w-12 h-12 mx-auto bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
                                                    <span className="text-white text-xl">🎨</span>
                                                </div>
                                                <h3 className="font-semibold text-lg">Rasm Yaratish</h3>
                                                <p className="text-sm text-muted-foreground mb-4">AI bilan rasmlar yarating</p>
                                                <ImageGenerator />
                                            </div>
                                        </div>
                                        
                                        <div className="p-6 border rounded-xl bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                                            <div className="text-center space-y-4">
                                                <div className="w-12 h-12 mx-auto bg-gradient-to-r from-green-500 to-cyan-500 rounded-full flex items-center justify-center">
                                                    <span className="text-white text-xl">🔍</span>
                                                </div>
                                                <h3 className="font-semibold text-lg">Rasm Tahlili</h3>
                                                <p className="text-sm text-muted-foreground mb-4">Rasmlarni tahlil qiling</p>
                                                <ImageAnalyzer />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Mobile layout - improved */}
                            {isMobile && (
                                <div className="w-full max-w-md space-y-6">
                                    <RealTimeClock />
                                    
                                    <div className="p-4 border rounded-lg bg-card/50">
                                        <h3 className="font-semibold text-center mb-3">Ovozli Yordamchi</h3>
                                        <VoiceAssistant />
                                    </div>
                                    
                                    <div className="p-4 border rounded-lg bg-card/50">
                                        <h3 className="font-semibold text-center mb-3">AI Rasm Yaratish</h3>
                                        <ImageGenerator />
                                    </div>
                                    
                                    <div className="p-4 border rounded-lg bg-card/50">
                                        <h3 className="font-semibold text-center mb-3">Rasm Tahlili</h3>
                                        <ImageAnalyzer />
                                    </div>
                                </div>
                            )}

                            {/* Engaging Features */}
                            <EngagingFeatures />

                            <div className="max-w-md w-full space-y-2 mt-8">
                                <button
                                    onClick={() => handleSendMessage("Sun'iy intellekt haqida qisqa hikoya aytib bering.")}
                                    className="w-full px-4 py-3 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors text-left hover:scale-[1.01] transition-transform duration-200"
                                >
                                    <p className="font-medium">Qisqa hikoya aytib bering</p>
                                    <p className="text-sm text-muted-foreground">sun'iy intellekt haqida</p>
                                </button>
                                <button
                                    onClick={() => handleSendMessage("Kvant hisoblashni oddiy tilda tushuntiring.")}
                                    className="w-full px-4 py-3 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors text-left hover:scale-[1.01] transition-transform duration-200"
                                >
                                    <p className="font-medium">Kvant hisoblashni tushuntiring</p>
                                    <p className="text-sm text-muted-foreground">oddiy tilda</p>
                                </button>
                                <button
                                    onClick={() => handleSendMessage("Sizni kim yaratgan?")}
                                    className="w-full px-4 py-3 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors text-left hover:scale-[1.01] transition-transform duration-200"
                                >
                                    <p className="font-medium">Sizni kim yaratgan?</p>
                                    <p className="text-sm text-muted-foreground">yaratuvchingiz haqida gapirib
                                        bering</p>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-3xl mx-auto">
                            {messages.map((message, index) => (
                                <ChatMessage
                                    key={index}
                                    message={message}
                                    index={index}
                                />
                            ))}
                            {isLoading && (
                                <div className="flex my-4 animate-fade-in">
                                    <div
                                        className="bg-accent rounded-2xl rounded-tl-none py-3 px-4 text-accent-foreground max-w-[85%]">
                                        <div className="typing-indicator">
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef}/>
                        </div>
                    )}
                </main>

                <div className="border-t p-4">
                    <div className="max-w-3xl mx-auto flex items-center gap-2">
                        <ChatInput onSendMessage={handleSendMessage} disabled={isLoading}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Index;
