import { useState } from "react";
import { Sparkles, Download, Loader2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setIsLoading(true);
    setImageUrl(null);

    try {
      const { data, error } = await supabase.functions.invoke("generate-image", {
        body: { prompt: prompt.trim() },
      });

      if (error) {
        console.error("Error generating image:", error);
        toast.error(error.message || "Failed to generate image");
        return;
      }

      if (data?.imageUrl) {
        setImageUrl(data.imageUrl);
        toast.success("Image generated successfully!");
      } else if (data?.error) {
        toast.error(data.error);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("Something went wrong. Please try again.");
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
      link.download = `ai-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Image downloaded!");
    } catch {
      toast.error("Failed to download image");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Input Section */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-xl blur-lg opacity-30 animate-pulse-glow" />
        <div className="relative glass rounded-xl p-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Wand2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe the image you want to create..."
                className="pl-12 h-14 bg-background/50 border-border/50 text-lg placeholder:text-muted-foreground/60 focus-visible:ring-primary/50"
                disabled={isLoading}
              />
            </div>
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
                  Generate
                </>
              )}
            </Button>
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
            <p className="text-muted-foreground animate-pulse">Creating your masterpiece...</p>
          </div>
        )}

        {!isLoading && !imageUrl && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 glass rounded-2xl border border-dashed border-border/50">
            <div className="p-4 rounded-full bg-secondary/50">
              <Sparkles className="h-12 w-12 text-muted-foreground" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-lg font-medium text-foreground/80">Your creation awaits</p>
              <p className="text-sm text-muted-foreground">Enter a prompt and hit generate</p>
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
                Download Image
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGenerator;
