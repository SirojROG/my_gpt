import {useState, FormEvent, KeyboardEvent, useRef, useEffect} from "react";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {Bot, Sticker} from "lucide-react";
import {cn} from "@/lib/utils";
import {Popover, PopoverTrigger, PopoverContent} from "@/components/ui/popover";

interface ChatInputProps {
    onSendMessage: (message: string) => void;
    disabled?: boolean;
}

// Define sticker types
interface StickerItem {
    id: string;
    emoji: string;
    category?: string;
}

const stickers: StickerItem[] = [
    // Faces category
    {id: "s1", emoji: "😊", category: "faces"},
    {id: "s2", emoji: "😂", category: "faces"},
    {id: "s3", emoji: "🥰", category: "faces"},
    {id: "s4", emoji: "😍", category: "faces"},
    {id: "s5", emoji: "🤔", category: "faces"},
    {id: "s6", emoji: "😎", category: "faces"},
    {id: "s7", emoji: "🥳", category: "faces"},
    {id: "s8", emoji: "🙄", category: "faces"},

    // Gestures category
    {id: "s9", emoji: "👍", category: "gestures"},
    {id: "s10", emoji: "👏", category: "gestures"},
    {id: "s11", emoji: "🙏", category: "gestures"},
    {id: "s12", emoji: "✌️", category: "gestures"},

    // Objects category
    {id: "s13", emoji: "❤️", category: "objects"},
    {id: "s14", emoji: "🔥", category: "objects"},
    {id: "s15", emoji: "🎉", category: "objects"},
    {id: "s16", emoji: "✨", category: "objects"},
    {id: "s17", emoji: "💯", category: "objects"},
    {id: "s18", emoji: "🚀", category: "objects"},
    {id: "s19", emoji: "💡", category: "objects"},
    {id: "s20", emoji: "🎮", category: "objects"},

    // New category: Animals
    {id: "s21", emoji: "🐶", category: "animals"},
    {id: "s22", emoji: "🐱", category: "animals"},
    {id: "s23", emoji: "🦊", category: "animals"},
    {id: "s24", emoji: "🐼", category: "animals"},
];

const ChatInput = ({onSendMessage, disabled}: ChatInputProps) => {
    const [message, setMessage] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [isStickersOpen, setIsStickersOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState<string>("faces");
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // Auto-focus the input field when the component mounts or after sending a message
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (message.trim() && !disabled) {
            onSendMessage(message);
            setMessage("");
            // Re-focus the input after sending a message
            setTimeout(() => {
                inputRef.current?.focus();
            }, 0);
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleStickerClick = (emoji: string) => {
        setMessage(prev => prev + emoji);
        setIsStickersOpen(false);
        // Focus the input after selecting a sticker
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    };

    const categories = Array.from(new Set(stickers.map(s => s.category)));

    return (
        <form onSubmit={handleSubmit} className="relative" style={{width: "100%"}}>
            <div className="flex items-center">
                <Popover open={isStickersOpen} onOpenChange={setIsStickersOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute left-2 bottom-2 z-10 hover:bg-accent transition-colors duration-200"
                            onClick={() => setIsStickersOpen(true)}
                        >
                            <Sticker className="h-5 w-5 text-muted-foreground"/>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[320px] p-0 bg-card/95 backdrop-blur-sm border-muted" align="start"
                                    side="top">
                        <div className="p-2 border-b flex justify-between items-center">
                            {/*<h4 className="font-medium text-sm" style={{width: "100%"}}>Select a Sticker</h4>*/}
                            <div className="flex gap-1">
                                {categories.map((category) => (
                                    <Button
                                        key={category}
                                        variant={activeCategory === category ? "default" : "ghost"}
                                        size="sm"
                                        className="text-xs px-2 py-1 h-7"
                                        onClick={() => setActiveCategory(category || "faces")}
                                    >
                                        {category}
                                    </Button>
                                ))}
                            </div>
                        </div>
                        <div
                            className="grid grid-cols-5 gap-2 p-3 max-h-[240px] overflow-y-auto custom-scrollbar animate-fade-in">
                            {stickers
                                .filter(s => s.category === activeCategory)
                                .map((sticker) => (
                                    <button
                                        key={sticker.id}
                                        type="button"
                                        onClick={() => handleStickerClick(sticker.emoji)}
                                        className="text-2xl p-3 hover:bg-accent rounded-xl transition-all duration-200 hover:scale-110 hover:shadow-md"
                                    >
                                        {sticker.emoji}
                                    </button>
                                ))}
                        </div>
                    </PopoverContent>
                </Popover>

                <Textarea
                    ref={inputRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Message aGPT..."
                    disabled={disabled}
                    className={cn(
                        "resize-none pl-12 pr-16 min-h-[56px] max-h-36 transition-all duration-300 font-poppins",
                        isFocused ? "border-primary shadow-sm shadow-primary/20" : ""
                    )}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
                <Button
                    type="submit"
                    size="icon"
                    className={cn(
                        "absolute right-2 bottom-2 transition-all duration-300",
                        message.trim() ? "bg-primary hover:bg-primary/90 scale-100" : "scale-95 opacity-90"
                    )}
                    disabled={!message.trim() || disabled}
                >
                    <Bot className={cn(
                        "h-5 w-5 transition-all",
                        disabled ? "animate-pulse" : ""
                    )}/>
                </Button>
            </div>
        </form>
    );
};

export default ChatInput;
