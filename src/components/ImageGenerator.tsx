import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Download, Loader2, Wand2, Image as ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import AppMenu from "@/components/AppMenu";

interface HistoryItem {
  id: string;
  prompt: string;
  image_url: string;
  created_at: string;
}

const ImageGenerator = () => {
  const { t, isRTL } = useLanguage();
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    const { data, error } = await supabase
      .from("image_history")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      console.error("Error fetching history:", error);
      return;
    }

    setHistory(data || []);
  };

  const saveToHistory = async (prompt: string, imageUrl: string) => {
    if (!user) return;
    
    const { error } = await supabase.from("image_history").insert({
      prompt,
      image_url: imageUrl,
      user_id: user.id,
    });

    if (error) {
      console.error("Error saving to history:", error);
      return;
    }

    fetchHistory();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error(isRTL ? "يرجى رفع صورة فقط" : "Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeUploadedImage = () => {
    setUploadedImage(null);
  };

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast.error(t.errorEnterPrompt);
      return;
    }

    setIsLoading(true);
    setImageUrl(null);

    try {
      let enhancedPrompt = prompt.trim();
      if (prompt.toLowerCase().includes("infographic") || prompt.includes("إنفوجرافيك")) {
        enhancedPrompt = `Educational infographic design, clean modern layout, colorful icons and illustrations, professional study material style: ${prompt.trim()}`;
      }

      const { data, error } = await supabase.functions.invoke("generate-image", {
        body: { 
          prompt: enhancedPrompt,
          sourceImage: uploadedImage
        },
      });

      if (error) {
        console.error("Error generating image:", error);
        toast.error(error.message || t.errorGenerate);
        return;
      }

      if (data?.imageUrl) {
        setImageUrl(data.imageUrl);
        await saveToHistory(prompt.trim(), data.imageUrl);
        toast.success(t.successGenerate);
        setUploadedImage(null);
      } else if (data?.error) {
        toast.error(data.error);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error(t.errorUnexpected);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      generateImage();
    }
  };

  const downloadImage = async () => {
    if (!imageUrl) return;

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `abbas-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success(t.successDownload);
    } catch {
      toast.error(t.errorDownload);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Menu - Top Right */}
      <div className={`absolute top-4 ${isRTL ? "left-4" : "right-4"} z-20`}>
        <AppMenu historyCount={history.length} />
      </div>

      {/* Image Upload Section */}
      <div className="flex justify-center">
        {uploadedImage ? (
          <div className="relative glass rounded-xl p-2 inline-block">
            <img
              src={uploadedImage}
              alt="Uploaded"
              className="h-24 w-24 object-cover rounded-lg"
            />
            <button
              onClick={removeUploadedImage}
              className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/80"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <div className="glass rounded-xl px-4 py-2 flex items-center gap-2 hover:bg-primary/10 transition-colors text-muted-foreground hover:text-foreground">
              <ImageIcon className="h-5 w-5" />
              <span className="text-sm">{isRTL ? "رفع صورة (اختياري)" : "Upload image (optional)"}</span>
            </div>
          </label>
        )}
      </div>

      {/* Input Section */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-xl blur-lg opacity-30 animate-pulse-glow" />
        <div className="relative glass rounded-xl p-2">
          <div className="flex gap-2">
            {isRTL && (
              <Button
                onClick={generateImage}
                disabled={isLoading || !prompt.trim()}
                className="h-14 px-6 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity text-primary-foreground font-semibold"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 ml-2" />
                    {t.generateBtn}
                  </>
                )}
              </Button>
            )}
            <div className="relative flex-1">
              <Wand2 className={`absolute ${isRTL ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground`} />
              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t.inputPlaceholder}
                className={`${isRTL ? "pr-12" : "pl-12"} h-14 bg-background/50 border-border/50 text-lg placeholder:text-muted-foreground/60 focus-visible:ring-primary/50`}
                disabled={isLoading}
              />
            </div>
            {!isRTL && (
              <Button
                onClick={generateImage}
                disabled={isLoading || !prompt.trim()}
                className="h-14 px-6 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity text-primary-foreground font-semibold"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    {t.generateBtn}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Result Section */}
      <div className="relative min-h-[400px]">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-primary animate-pulse" />
            </div>
            <p className="text-muted-foreground animate-pulse">{t.creating}</p>
          </div>
        )}

        {!isLoading && !imageUrl && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 glass rounded-2xl border border-dashed border-border/50">
            <div className="p-4 rounded-full bg-secondary/50">
              <Sparkles className="h-12 w-12 text-muted-foreground" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-lg font-medium text-foreground/80">{t.waitingTitle}</p>
              <p className="text-sm text-muted-foreground">{t.waitingSubtitle}</p>
            </div>
          </div>
        )}

        {!isLoading && imageUrl && (
          <div className="animate-fade-in space-y-4">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-xl opacity-50" />
              <img
                src={imageUrl}
                alt="Generated image"
                className="relative w-full rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
            </div>

            <div className="flex justify-center">
              <Button
                onClick={downloadImage}
                variant="outline"
                className="gap-2 border-border/50 hover:bg-secondary hover:border-primary/50 transition-all"
              >
                <Download className="h-4 w-4" />
                {t.downloadImage}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGenerator;
