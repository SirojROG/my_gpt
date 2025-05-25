
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Zap, Heart, Star, Gift, Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';

const EngagingFeatures = () => {
    const [selectedFeature, setSelectedFeature] = useState(0);

    const features = [
        {
            icon: Sparkles,
            title: "AI Yordamchi",
            description: "Har qanday savolingizga javob olish",
            color: "from-purple-500 to-pink-500",
            benefit: "24/7 yordam"
        },
        {
            icon: Zap,
            title: "Tez Javob",
            description: "Bir necha soniyada javob",
            color: "from-yellow-500 to-orange-500",
            benefit: "Vaqt tejash"
        },
        {
            icon: Heart,
            title: "O'zbek tili",
            description: "To'liq o'zbek tilida muloqot",
            color: "from-red-500 to-pink-500",
            benefit: "Qulay muloqot"
        },
        {
            icon: Star,
            title: "Sifatli Javob",
            description: "Professional va aniq javoblar",
            color: "from-blue-500 to-cyan-500",
            benefit: "Yuqori sifat"
        },
        {
            icon: Gift,
            title: "Bepul Xizmat",
            description: "Hech qanday to'lov talab qilinmaydi",
            color: "from-green-500 to-emerald-500",
            benefit: "Tekin foydalanish"
        },
        {
            icon: Rocket,
            title: "Doimiy Yangilanish",
            description: "Har doim yangi imkoniyatlar",
            color: "from-indigo-500 to-purple-500",
            benefit: "Rivojlanish"
        }
    ];

    return (
        <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold gradient-text">aGPT bilan nima qila olasiz?</h2>
                <p className="text-muted-foreground">Eng zamonaviy AI texnologiyasidan foydalaning</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {features.map((feature, index) => {
                    const Icon = feature.icon;
                    const isSelected = selectedFeature === index;
                    
                    return (
                        <Card 
                            key={index}
                            className={cn(
                                "cursor-pointer transition-all duration-300 hover:scale-105",
                                "border-2 hover:shadow-lg group",
                                isSelected ? "border-primary shadow-lg scale-105" : "border-border"
                            )}
                            onClick={() => setSelectedFeature(index)}
                        >
                            <CardHeader className="text-center pb-3">
                                <div className={cn(
                                    "w-12 h-12 rounded-full mx-auto flex items-center justify-center",
                                    "bg-gradient-to-r", feature.color,
                                    "group-hover:scale-110 transition-transform duration-300"
                                )}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                                <CardTitle className="text-lg">{feature.title}</CardTitle>
                                <CardDescription>{feature.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="text-center pt-0">
                                <Badge 
                                    variant="secondary" 
                                    className={cn(
                                        "transition-colors duration-300",
                                        isSelected && "bg-primary text-primary-foreground"
                                    )}
                                >
                                    {feature.benefit}
                                </Badge>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="text-center">
                <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-primary to-accent hover:scale-105 transition-transform duration-300"
                    onClick={() => {
                        // Scroll to chat input
                        const chatInput = document.querySelector('[placeholder*="xabar"]');
                        chatInput?.scrollIntoView({ behavior: 'smooth' });
                    }}
                >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Hoziroq boshlang!
                </Button>
            </div>
        </div>
    );
};

export default EngagingFeatures;
