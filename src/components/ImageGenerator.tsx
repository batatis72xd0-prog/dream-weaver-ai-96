import { useState, useEffect } from "react";
import { Sparkles, Download, Loader2, Wand2, History, Trash2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/hooks/useLanguage";

interface HistoryItem {
  id: string;
  prompt: string;
  image_url: string;
  created_at: string;
}

const ImageGenerator = () => {
  const { t, isRTL } = useLanguage();
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

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
    const { error } = await supabase.from("image_history").insert({
      prompt,
      image_url: imageUrl,
    });

    if (error) {
      console.error("Error saving to history:", error);
      return;
    }

    fetchHistory();
  };

  const deleteFromHistory = async (id: string) => {
    const { error } = await supabase.from("image_history").delete().eq("id", id);

    if (error) {
      console.error("Error deleting from history:", error);
      toast.error(t.errorDelete);
      return;
    }

    toast.success(t.successDelete);
    fetchHistory();
  };

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast.error(t.errorEnterPrompt);
      return;
    }

    setIsLoading(true);
    setImageUrl(null);

    try {
      // Enhance prompt for infographic if it contains infographic keywords
      let enhancedPrompt = prompt.trim();
      if (prompt.toLowerCase().includes("infographic") || prompt.includes("إنفوجرافيك")) {
        enhancedPrompt = `Educational infographic design, clean modern layout, colorful icons and illustrations, professional study material style: ${prompt.trim()}`;
      }

      const { data, error } = await supabase.functions.invoke("generate-image", {
        body: { prompt: enhancedPrompt },
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

  const selectHistoryItem = (item: HistoryItem) => {
    setImageUrl(item.image_url);
    setPrompt(item.prompt);
    setShowHistory(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Quick Prompts for Infographics */}
      <div className="flex flex-wrap justify-center gap-2">
        <span className="text-sm text-muted-foreground flex items-center gap-1">
          <BookOpen className="h-4 w-4" />
          {t.quickIdeas}
        </span>
        {t.infographicPrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => setPrompt(p)}
            className="text-xs px-3 py-1.5 rounded-full glass hover:bg-primary/20 transition-colors text-muted-foreground hover:text-foreground"
          >
            {p}
          </button>
        ))}
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

      {/* History Toggle */}
      <div className="flex justify-center">
        <Button
          variant="ghost"
          onClick={() => setShowHistory(!showHistory)}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <History className="h-4 w-4" />
          {showHistory ? t.hideHistory : t.showHistory}
          {history.length > 0 && (
            <span className="bg-primary/20 text-primary px-2 py-0.5 rounded-full text-xs">
              {history.length}
            </span>
          )}
        </Button>
      </div>

      {/* History Section */}
      {showHistory && history.length > 0 && (
        <div className="glass rounded-xl p-4 animate-fade-in">
          <h3 className="text-lg font-semibold mb-4 text-foreground">{t.history}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {history.map((item) => (
              <div
                key={item.id}
                className="relative group cursor-pointer rounded-lg overflow-hidden"
              >
                <img
                  src={item.image_url}
                  alt={item.prompt}
                  className="w-full aspect-square object-cover transition-transform group-hover:scale-105"
                  onClick={() => selectHistoryItem(item)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-2">
                    <p className="text-xs text-foreground line-clamp-2 mb-2">{item.prompt}</p>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteFromHistory(item.id);
                      }}
                      className="w-full h-7 text-xs"
                    >
                      <Trash2 className={`h-3 w-3 ${isRTL ? "ml-1" : "mr-1"}`} />
                      {t.delete}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
