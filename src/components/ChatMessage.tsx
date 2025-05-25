
import {Message} from "@/types/chat";
import {Avatar} from "@/components/ui/avatar";
import {Bot, User, Copy, Check} from "lucide-react";
import {cn} from "@/lib/utils";
import ReactMarkdown from 'react-markdown';
import {AvatarImage} from "./ui/avatar";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import {useToast} from "@/hooks/use-toast";

interface ChatMessageProps {
    message: Message;
    index: number;
}

const ChatMessage = ({message, index}: ChatMessageProps) => {
    const isUser = message.role === "user";
    const [copiedStates, setCopiedStates] = useState<{[key: number]: boolean}>({});
    const [messageCopied, setMessageCopied] = useState(false);
    const {toast} = useToast();
    
    const date = new Date(message.timestamp);
    const formattedTime = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
    }).format(date);

    const copyToClipboard = async (text: string, codeIndex: number) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedStates(prev => ({...prev, [codeIndex]: true}));
            toast({
                title: "Kod nusxa olindi!",
                duration: 2000,
            });
            
            // Reset copied state after 2 seconds
            setTimeout(() => {
                setCopiedStates(prev => ({...prev, [codeIndex]: false}));
            }, 2000);
        } catch (err) {
            toast({
                title: "Nusxa olishda xatolik",
                variant: "destructive",
                duration: 2000,
            });
        }
    };

    const copyMessage = async () => {
        try {
            await navigator.clipboard.writeText(message.content);
            setMessageCopied(true);
            toast({
                title: "Xabar nusxa olindi!",
                duration: 2000,
            });
            
            setTimeout(() => {
                setMessageCopied(false);
            }, 2000);
        } catch (err) {
            toast({
                title: "Nusxa olishda xatolik",
                variant: "destructive",
                duration: 2000,
            });
        }
    };

    const CodeBlock = ({children, className, ...props}: any) => {
        const codeIndex = Math.random();
        const isCopied = copiedStates[codeIndex];
        
        if (className?.includes('language-')) {
            return (
                <div className="relative group">
                    <pre className={cn(
                        "bg-muted p-4 rounded-lg overflow-x-auto border",
                        "group-hover:bg-muted/80 transition-colors"
                    )} {...props}>
                        <code className={className}>
                            {children}
                        </code>
                    </pre>
                    <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                            "absolute top-2 right-2 opacity-0 group-hover:opacity-100",
                            "transition-all duration-200 h-8 w-8 p-0",
                            "hover:bg-accent/50 border border-border/50"
                        )}
                        onClick={() => copyToClipboard(children as string, codeIndex)}
                    >
                        {isCopied ? (
                            <Check className="h-4 w-4 text-green-500" />
                        ) : (
                            <Copy className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            );
        }
        
        return (
            <code className="bg-muted px-2 py-1 rounded text-sm" {...props}>
                {children}
            </code>
        );
    };

    return (
        <div className={cn(
            "py-4 flex gap-4 chat-message-animation group",
            isUser ? "justify-end" : ""
        )}
             style={{
                 animationDelay: `${index * 0.1}s`,
             }}>
            {!isUser && (
                <Avatar
                    className="h-9 w-9 bg-primary text-primary-foreground ring-2 ring-primary/20 transition-transform hover:scale-105"
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                    <AvatarImage src="/agpt-avatar.png" alt="aGPT Assistant"/>
                    <Bot className="h-5 w-5"/>
                </Avatar>
            )}

            <div className={cn(
                "flex flex-col max-w-[85%]",
                isUser ? "items-end" : ""
            )}>
                <div className={cn(
                    "rounded-2xl py-3 px-4 shadow-sm transition-all",
                    isUser
                        ? "bg-primary text-primary-foreground rounded-tr-none hover:shadow-md hover:shadow-primary/20"
                        : "bg-secondary text-secondary-foreground rounded-tl-none hover:shadow-md hover:shadow-secondary/20"
                )}>
                    {isUser ? (
                        <p className="whitespace-pre-wrap">{message.content}</p>
                    ) : (
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                            <ReactMarkdown
                                components={{
                                    code: CodeBlock,
                                    pre: CodeBlock
                                }}
                            >
                                {message.content}
                            </ReactMarkdown>
                        </div>
                    )}
                </div>
                
                {/* Copy button below the message for AI responses */}
                {!isUser && (
                    <div className="flex items-center justify-between w-full mt-2">
                        <span className="text-xs text-muted-foreground">
                            {formattedTime}
                        </span>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 hover:bg-accent/50"
                            onClick={copyMessage}
                        >
                            {messageCopied ? (
                                <Check className="h-3 w-3 text-green-500" />
                            ) : (
                                <Copy className="h-3 w-3" />
                            )}
                        </Button>
                    </div>
                )}
                
                {/* Time for user messages */}
                {isUser && (
                    <span className="text-xs text-muted-foreground mt-1">
                        {formattedTime}
                    </span>
                )}
            </div>

            {isUser && (
                <Avatar className="h-9 w-9 bg-secondary ring-2 ring-secondary/20 transition-transform hover:scale-105"
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                    <AvatarImage src="/agpt-user-avatar.png" alt="User"/>
                    <User className="h-5 w-5"/>
                </Avatar>
            )}
        </div>
    );
};

export default ChatMessage;
