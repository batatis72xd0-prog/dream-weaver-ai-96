import { useState, useEffect, createContext, useContext, ReactNode } from "react";

type Language = "en" | "ar";

interface Translations {
  appName: string;
  tagline: string;
  subtitle: string;
  generateBtn: string;
  inputPlaceholder: string;
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
}

const translations: Record<Language, Translations> = {
  en: {
    appName: "Abbas",
    tagline: "AI-Abbas Image Generation",
    subtitle: "Transform your ideas into images using Abbas AI. Describe what you want, and watch it come to life. Specialized in educational infographics.",
    generateBtn: "Generate",
    inputPlaceholder: "Describe the image or infographic you want to create...",
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
  },
  ar: {
    appName: "عبّاس",
    tagline: "توليد الصور بذكاء عبّاس",
    subtitle: "حوّل أفكارك إلى صور باستخدام ذكاء عبّاس. اكتب ما تريد وشاهده يتحول إلى واقع. متخصص في الإنفوجرافيك التعليمي.",
    generateBtn: "إنشاء",
    inputPlaceholder: "اكتب وصفاً للصورة أو الإنفوجرافيك الذي تريد إنشاءه...",
    history: "السجل",
    delete: "حذف",
    creating: "جارٍ إنشاء تحفتك الفنية...",
    waitingTitle: "إبداعك في انتظارك",
    waitingSubtitle: "أدخل وصفاً واضغط على إنشاء",
    downloadImage: "تحميل الصورة",
    footerHint: "اضغط Enter أو انقر على إنشاء لتوليد صورتك",
    errorEnterPrompt: "الرجاء إدخال وصف للصورة",
    errorGenerate: "فشل في إنشاء الصورة",
    errorUnexpected: "حدث خطأ غير متوقع. حاول مرة أخرى.",
    successGenerate: "تم إنشاء الصورة بنجاح!",
    successDownload: "تم تحميل الصورة!",
    errorDownload: "فشل في تحميل الصورة",
    successDelete: "تم حذف الصورة",
    errorDelete: "فشل في حذف الصورة",
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
