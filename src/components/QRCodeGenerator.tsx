
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { QrCode, Video, Upload, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Maximum file size in bytes (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const QRCodeGenerator = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const [qrCodeURL, setQrCodeURL] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    
    const file = e.target.files[0];
    
    // Check if file is a video
    if (!file.type.startsWith('video/')) {
      toast({
        title: "Noto'g'ri fayl turi",
        description: "Faqat video fayllar qabul qilinadi",
        variant: "destructive",
      });
      return;
    }
    
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "Fayl hajmi katta",
        description: "Maksimal fayl hajmi 5MB",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedFile(file);
    setVideoURL(URL.createObjectURL(file));
    setQrCodeURL(null);
  };

  const generateQRCode = async () => {
    if (!videoURL) return;
    
    setIsLoading(true);
    
    try {
      // Using QR Server API to generate QR code
      const encodedURL = encodeURIComponent(videoURL);
      const qrURL = `https://api.qrserver.com/v1/create-qr-code/?data=${encodedURL}&size=200x200&margin=20`;
      
      setQrCodeURL(qrURL);
      
      toast({
        title: "QR kod yaratildi",
        description: "Video uchun QR kod muvaffaqiyatli yaratildi",
      });
    } catch (error) {
      toast({
        title: "Xatolik yuz berdi",
        description: "QR kod yaratishda xatolik yuz berdi",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setVideoURL(null);
    setQrCodeURL(null);
  };

  const closeDialog = () => {
    setOpen(false);
    resetForm();
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <QrCode className="h-4 w-4" />
          <span>Video QR kod</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center gradient-text">Video QR kod yaratish</DialogTitle>
          <DialogDescription className="text-center pt-2">
            Videoni yuklang va u uchun QR kod oling
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col space-y-4 mt-4">
          {!selectedFile ? (
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <div className="flex flex-col items-center justify-center space-y-2">
                <Video className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Video yuklash uchun bosing yoki sudrab tashlang (max 5MB)
                </p>
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  id="video-upload"
                  onChange={handleFileChange}
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('video-upload')?.click()}
                  className="mt-2"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Video tanlang
                </Button>
              </div>
            </div>
          ) : (
            <>
              {videoURL && (
                <div className="flex flex-col space-y-2">
                  <p className="text-sm font-medium">Tanlangan video:</p>
                  <div className="w-full relative rounded overflow-hidden">
                    <video 
                      src={videoURL} 
                      controls 
                      className="w-full h-auto rounded" 
                      style={{ maxHeight: '200px' }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                  </p>
                </div>
              )}
              
              <div className="flex justify-center space-x-2">
                <Button variant="outline" onClick={resetForm} disabled={isLoading}>
                  Bekor qilish
                </Button>
                <Button onClick={generateQRCode} disabled={isLoading || !videoURL}>
                  {isLoading ? "Yaratilmoqda..." : "QR kod yaratish"}
                </Button>
              </div>
              
              {qrCodeURL && (
                <div className="flex flex-col items-center space-y-2 mt-4 pt-4 border-t">
                  <p className="text-sm font-medium">Sizning QR kodingiz:</p>
                  <div className="bg-white p-2 rounded">
                    <img src={qrCodeURL} alt="QR Code" className="w-40 h-40" />
                  </div>
                  <Button variant="outline" asChild className="w-full">
                    <a href={qrCodeURL} download="video-qr-code.png" target="_blank" rel="noopener noreferrer">
                      QR kodni yuklab olish
                    </a>
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Eslatma: QR kod faqat shu brauzer sessiyasi uchun ishlaydi. 
                    Doimiy saqlash uchun videoni serverga yuklab olish kerak.
                  </p>
                </div>
              )}
            </>
          )}
          
          <div className="text-xs flex items-start gap-2 px-2 pb-2 text-muted-foreground">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <p>
              Video QR kodi faqat shu qurilmada ishlaydi. Ijtimoiy tarmoqlarda ulashish uchun videoni avval serverga yuklash kerak.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeGenerator;
