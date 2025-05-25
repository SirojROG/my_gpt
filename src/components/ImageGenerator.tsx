
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Image, Loader2, Download, Sparkles } from 'lucide-react';

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const { toast } = useToast();

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Tavsif kiriting",
        description: "Iltimos, rasm uchun tavsif yozing",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Bu yerda haqiqiy AI rasm generatori API chaqiriladi
      // Hozircha demo uchun placeholder rasm ishlatamiz
      await new Promise(resolve => setTimeout(resolve, 3000)); // 3 soniya kutish
      
      // Demo placeholder rasm
      const placeholderImage = `https://picsum.photos/512/512?random=${Date.now()}`;
      setGeneratedImage(placeholderImage);
      
      toast({
        title: "Rasm tayyor!",
        description: "Rasm muvaffaqiyatli yaratildi",
      });
    } catch (error) {
      console.error('Image generation error:', error);
      toast({
        title: "Xatolik",
        description: "Rasm yaratishda xatolik yuz berdi",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `aGPT-generated-${Date.now()}.jpg`;
      link.click();
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/20">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-2 rounded-full bg-orange-500/20">
          <Image className="h-4 w-4 text-orange-600" />
        </div>
        <h3 className="font-semibold text-sm">AI Rasm Yaratish</h3>
      </div>

      <div className="space-y-3">
        <Input
          placeholder="Rasm tavsifini kiriting... (masalan: 'ko'k osmonda uchayotgan qush')"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="text-sm"
          disabled={isGenerating}
        />

        <Button
          onClick={generateImage}
          disabled={isGenerating || !prompt.trim()}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white gap-2"
          size="sm"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Yaratilmoqda...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Rasm Yaratish
            </>
          )}
        </Button>

        {generatedImage && (
          <div className="space-y-3">
            <div className="relative">
              <img
                src={generatedImage}
                alt="Generated"
                className="w-full h-40 object-cover rounded-lg border"
              />
            </div>
            <Button
              onClick={downloadImage}
              variant="outline"
              size="sm"
              className="w-full gap-2"
            >
              <Download className="h-4 w-4" />
              Rasmni Yuklab Olish
            </Button>
          </div>
        )}
      </div>

      <div className="text-xs text-muted-foreground">
        💡 Rasm tavsifini aniq va batafsil yozing
      </div>
    </div>
  );
};

export default ImageGenerator;
