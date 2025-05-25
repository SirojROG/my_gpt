// components/VoiceAssistant.tsx

'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Mic,
    MicOff,
    Volume2,
    Square,
    Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateResponse } from '@/utils/ai';

const VoiceAssistant = () => {
    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [lastResponse, setLastResponse] = useState('');
    const { toast } = useToast();

    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

    useEffect(() => {
        const SpeechRecognitionAPI =
            window.SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (SpeechRecognitionAPI) {
            const recognition = new SpeechRecognitionAPI();
            recognition.lang = 'uz-UZ';
            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onresult = async (event: SpeechRecognitionEvent) => {
                const result = event.results[0][0].transcript;
                setTranscript(result);
                setIsListening(false);
                setIsProcessing(true);

                try {
                    const response = await generateResponse(result);
                    setLastResponse(response);
                    speakText(response);
                    toast({
                        title: "Ovozli so'rov bajarildi",
                        description: "Javob tayyor",
                    });
                } catch (err) {
                    console.error('Xatolik:', err);
                    toast({
                        title: "Xatolik",
                        description: "So‘rovni qayta ishlashda xatolik yuz berdi",
                        variant: "destructive",
                    });
                } finally {
                    setIsProcessing(false);
                }
            };

            recognition.onerror = () => {
                setIsListening(false);
                setIsProcessing(false);
                toast({
                    title: "Xatolik",
                    description: "Ovozni tanib olishda xatolik",
                    variant: "destructive",
                });
            };

            recognitionRef.current = recognition;
        }

        window.speechSynthesis.onvoiceschanged = () => {
            console.log('Mavjud ovozlar:', window.speechSynthesis.getVoices());
        };

        return () => {
            recognitionRef.current?.stop();
            speechSynthesis.cancel();
        };
    }, [toast]);

    const startListening = () => {
        if (!recognitionRef.current) {
            toast({
                title: "Qo‘llab-quvvatlanmaydi",
                description: "Brauzeringiz ovozli tanib olishni qo‘llab-quvvatlamaydi",
                variant: "destructive",
            });
            return;
        }

        setTranscript('');
        setIsListening(true);
        recognitionRef.current.start();
        toast({
            title: "Tinglanmoqda...",
            description: "Gapiring, sizni tinglayapman!",
        });
    };

    const stopListening = () => {
        recognitionRef.current?.stop();
        setIsListening(false);
    };

    const speakText = async (text: string) => {
        try {
            const response = await fetch('/api/speak', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text }),
            });

            const data = await response.json();
            const audio = new Audio(data.audioUrl);
            audio.play();
            setIsSpeaking(true);

            audio.onended = () => {
                setIsSpeaking(false);
            };
        } catch (err) {
            console.error('Audio olishda xatolik:', err);
        }
    };



    const stopSpeaking = () => {
        speechSynthesis.cancel();
        setIsSpeaking(false);
    };

    const repeatLastResponse = () => {
        if (lastResponse) speakText(lastResponse);
    };

    return (
        <div className="space-y-4 p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
            <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-full bg-blue-500/20">
                    <Mic className="h-4 w-4 text-blue-600" />
                </div>
                <h3 className="font-semibold text-sm">Ovozli AI Yordamchi</h3>
            </div>

            <div className="flex flex-wrap gap-2">
                {!isListening && !isProcessing ? (
                    <Button
                        onClick={startListening}
                        size="sm"
                        className="bg-green-500 hover:bg-green-600 text-white gap-2"
                    >
                        <Mic className="h-4 w-4" />
                        Gapiring
                    </Button>
                ) : (
                    <Button
                        onClick={stopListening}
                        size="sm"
                        variant="destructive"
                        className="gap-2"
                        disabled={isProcessing}
                    >
                        {isProcessing ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <MicOff className="h-4 w-4" />
                        )}
                        {isProcessing ? 'Qayta ishlanmoqda...' : 'To‘xtatish'}
                    </Button>
                )}

                {isSpeaking ? (
                    <Button onClick={stopSpeaking} size="sm" variant="outline" className="gap-2">
                        <Square className="h-4 w-4" />
                        To‘xtat
                    </Button>
                ) : (
                    <Button
                        onClick={repeatLastResponse}
                        size="sm"
                        variant="outline"
                        className="gap-2"
                        disabled={!lastResponse}
                    >
                        <Volume2 className="h-4 w-4" />
                        Takrorlash
                    </Button>
                )}
            </div>

            {transcript && (
                <div className="mt-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-md border">
                    <p className="text-sm text-muted-foreground mb-1">Sizning so‘rovingiz:</p>
                    <p className="text-sm font-medium">{transcript}</p>
                </div>
            )}

            {lastResponse && (
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-md border">
                    <p className="text-sm text-muted-foreground mb-1">AI javobi:</p>
                    <p className="text-sm">{lastResponse}</p>
                </div>
            )}

            <div className="text-xs text-muted-foreground">
                💡 Gapiring — AI sizni eshitadi va javob qaytaradi!
            </div>
        </div>
    );
};

export default VoiceAssistant;
