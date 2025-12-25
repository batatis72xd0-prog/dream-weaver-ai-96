import { Sparkles, BookOpen } from "lucide-react";
import ImageGenerator from "@/components/ImageGenerator";
import { useLanguage } from "@/hooks/useLanguage";

const Index = () => {
  const { t, isRTL } = useLanguage();

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-background relative overflow-hidden font-sans">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "-3s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/5 to-accent/5 rounded-full blur-3xl" />
      </div>

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 container mx-auto px-4 py-12 md:py-20">
        {/* Header */}
        <header className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>{t.tagline}</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            <span className="text-gradient">{t.appName}</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {t.subtitle}
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-sm text-accent-foreground">
            <BookOpen className="h-4 w-4" />
            <span>{t.infographicBadge}</span>
          </div>
        </header>

        {/* Generator */}
        <ImageGenerator />

        {/* Footer hint */}
        <footer className="mt-16 text-center">
          <p className="text-sm text-muted-foreground/60">
            {t.footerHint}
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
