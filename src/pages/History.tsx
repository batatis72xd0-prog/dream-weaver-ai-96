import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Download, Trash2, ArrowLeft, ArrowRight, ImageOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";

interface HistoryItem {
  id: string;
  prompt: string;
  image_url: string;
  created_at: string;
}

const History = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isLoading: authLoading } = useAuth();
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();

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
    setIsLoading(true);
    const { data, error } = await supabase
      .from("image_history")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching history:", error);
      toast.error(isRTL ? "فشل في تحميل السجل" : "Failed to load history");
    } else {
      setHistory(data || []);
    }
    setIsLoading(false);
  };

  const deleteFromHistory = async (id: string) => {
    const { error } = await supabase.from("image_history").delete().eq("id", id);

    if (error) {
      toast.error(isRTL ? "فشل في حذف الصورة" : "Failed to delete image");
      return;
    }

    toast.success(isRTL ? "تم حذف الصورة" : "Image deleted");
    setHistory(history.filter((item) => item.id !== id));
  };

  const downloadImage = async (imageUrl: string, prompt: string) => {
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
      toast.success(isRTL ? "تم تحميل الصورة!" : "Image downloaded!");
    } catch {
      toast.error(isRTL ? "فشل في تحميل الصورة" : "Failed to download image");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-background">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "-3s" }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            {isRTL ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
            {isRTL ? "العودة" : "Back"}
          </Button>
          <h1 className="text-3xl font-bold text-gradient">
            {isRTL ? "سجل الصور" : "Image History"}
          </h1>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-20 glass rounded-2xl">
            <ImageOff className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              {isRTL ? "لا توجد صور" : "No images yet"}
            </h2>
            <p className="text-muted-foreground mb-4">
              {isRTL ? "ابدأ بإنشاء صورتك الأولى!" : "Start by generating your first image!"}
            </p>
            <Button onClick={() => navigate("/")}>
              {isRTL ? "إنشاء صورة" : "Generate Image"}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {history.map((item) => (
              <div
                key={item.id}
                className="glass rounded-xl overflow-hidden group"
              >
                <div className="relative aspect-square">
                  <img
                    src={item.image_url}
                    alt={item.prompt}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-4 space-y-3">
                  <p className="text-sm text-foreground line-clamp-2">{item.prompt}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(item.created_at).toLocaleDateString(isRTL ? "ar" : "en")}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadImage(item.image_url, item.prompt)}
                      className="flex-1 gap-2"
                    >
                      <Download className="h-4 w-4" />
                      {isRTL ? "تحميل" : "Download"}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteFromHistory(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
