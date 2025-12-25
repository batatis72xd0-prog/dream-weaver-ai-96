import { useState, useEffect, createContext, useContext, ReactNode } from "react";

type Language = "en" | "ar";

interface Translations {
  appName: string;
  tagline: string;
  subtitle: string;
  infographicBadge: string;
  quickIdeas: string;
  generateBtn: string;
  inputPlaceholder: string;
  showHistory: string;
  hideHistory: string;
  history: string;
  delete: string;
  creating: string;
  waitingTitle: string;
  waitingSubtitle: string;
  downloadImage: string;
  footerHint: string;
  errorEnterPrompt: string;
  errorGenerate: string;
  errorUnexpected: string;
  successGenerate: string;
  successDownload: string;
  errorDownload: string;
  successDelete: string;
  errorDelete: string;
  infographicPrompts: string[];
}

const translations: Record<Language, Translations> = {
  en: {
    appName: "Abbas",
    tagline: "AI-Powered Image Generation",
    subtitle: "Transform your ideas into stunning visuals and educational infographics. Describe what you envision and watch AI bring it to life.",
    infographicBadge: "Specialized in Educational Infographics",
    quickIdeas: "Quick ideas:",
    generateBtn: "Generate",
    inputPlaceholder: "Describe the image or infographic you want to create...",
    showHistory: "Show History",
    hideHistory: "Hide History",
    history: "History",
    delete: "Delete",
    creating: "Creating your masterpiece...",
    waitingTitle: "Your creation awaits",
    waitingSubtitle: "Enter a prompt and click Generate",
    downloadImage: "Download Image",
    footerHint: "Press Enter or click Generate to create your image",
    errorEnterPrompt: "Please enter a prompt",
    errorGenerate: "Failed to generate image",
    errorUnexpected: "Something went wrong. Please try again.",
    successGenerate: "Image generated successfully!",
    successDownload: "Image downloaded!",
    errorDownload: "Failed to download image",
    successDelete: "Image deleted",
    errorDelete: "Failed to delete image",
    infographicPrompts: [
      "Infographic about the circulatory system",
      "Infographic about the solar system",
      "Infographic about the water cycle",
      "Infographic about the five pillars of Islam",
      "Infographic about plant growth stages",
    ],
  },
  ar: {
    appName: "عباس",
    tagline: "مولد الصور بالذكاء الاصطناعي",
    subtitle: "حوّل أفكارك إلى صور مذهلة وإنفوجرافيك تعليمي. اكتب ما تتخيله وشاهد الذكاء الاصطناعي يجلبه للحياة.",
    infographicBadge: "متخصص في الإنفوجرافيك التعليمي",
    quickIdeas: "أفكار سريعة:",
    generateBtn: "إنشاء",
    inputPlaceholder: "صف الصورة أو الإنفوجرافيك الذي تريد إنشاءه...",
    showHistory: "عرض السجل",
    hideHistory: "إخفاء السجل",
    history: "السجل",
    delete: "حذف",
    creating: "جاري إنشاء تحفتك الفنية...",
    waitingTitle: "إبداعك في انتظارك",
    waitingSubtitle: "أدخل وصفاً واضغط على إنشاء",
    downloadImage: "تحميل الصورة",
    footerHint: "اضغط Enter أو انقر على \"إنشاء\" لتوليد صورتك",
    errorEnterPrompt: "الرجاء إدخال وصف للصورة",
    errorGenerate: "فشل في إنشاء الصورة",
    errorUnexpected: "حدث خطأ غير متوقع. حاول مرة أخرى.",
    successGenerate: "تم إنشاء الصورة بنجاح!",
    successDownload: "تم تحميل الصورة!",
    errorDownload: "فشل في تحميل الصورة",
    successDelete: "تم حذف الصورة",
    errorDelete: "فشل في حذف الصورة",
    infographicPrompts: [
      "إنفوجرافيك عن الدورة الدموية",
      "إنفوجرافيك عن النظام الشمسي",
      "إنفوجرافيك عن دورة المياه في الطبيعة",
      "إنفوجرافيك عن أركان الإسلام",
      "إنفوجرافيك عن مراحل نمو النبات",
    ],
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    return (saved as Language) || "en";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language],
    isRTL: language === "ar",
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
