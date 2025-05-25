
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { FileText, Upload, Loader2, Eye } from 'lucide-react';

const ImageAnalyzer = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedImage(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
        setAnalysisResult(null);
      } else {
        toast({
          title: "Noto'g'ri fayl turi",
          description: "Iltimos, rasm faylini tanlang",
          variant: "destructive",
        });
      }
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    
    try {
      // Bu yerda haqiqiy AI rasm tahlili API chaqiriladi
      // Hozircha demo uchun placeholder matn ishlatamiz
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2 soniya kutish
      
      const demoAnalysis = `Bu rasmda quyidagilar ko'rinmoqda:
      
🖼️ Rasm tavsifi: ${selectedImage.name.replace(/\.[^/.]+$/, "")} nomli rasm
📏 O'lcham: ${Math.round(selectedImage.size / 1024)} KB
🎨 Rang sxemasi: Asosan issiq ranglar
🏷️ Mavzu: Tabiat va landshaft
✨ Sifat: Yuqori aniqlik
      
Bu rasm juda chiroyli va professional ko'rinadi. Ranglar uyg'un va kompozitsiya muvozanatli.`;
      
      setAnalysisResult(demoAnalysis);
      
      toast({
        title: "Tahlil tayyor!",
        description: "Rasm muvaffaqiyatli tahlil qilindi",
      });
    } catch (error) {
      console.error('Image analysis error:', error);
      toast({
        title: "Xatolik",
        description: "Rasm tahlil qilishda xatolik yuz berdi",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-2 rounded-full bg-cyan-500/20">
          <FileText className="h-4 w-4 text-cyan-600" />
        </div>
        <h3 className="font-semibold text-sm">Rasm Tahlili</h3>
      </div>

      <div className="space-y-3">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          ref={fileInputRef}
          className="hidden"
        />

        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
          className="w-full gap-2"
          size="sm"
        >
          <Upload className="h-4 w-4" />
          Rasm Tanlash
        </Button>

        {imagePreview && (
          <div className="space-y-3">
            <div className="relative">
              <img
                src={imagePreview}
                alt="Selected"
                className="w-full h-32 object-cover rounded-lg border"
              />
            </div>
            
            <Button
              onClick={analyzeImage}
              disabled={isAnalyzing}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white gap-2"
              size="sm"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Tahlil qilinmoqda...
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  Rasmni Tahlil Qilish
                </>
              )}
            </Button>
          </div>
        )}

        {analysisResult && (
          <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-md border text-xs">
            <p className="font-medium mb-1">Tahlil natijasi:</p>
            <pre className="whitespace-pre-wrap text-xs">{analysisResult}</pre>
          </div>
        )}
      </div>

      <div className="text-xs text-muted-foreground">
        📷 Rasm yuklang va AI tahlil qilsin
      </div>
    </div>
  );
};

export default ImageAnalyzer;
