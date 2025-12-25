import { useState } from "react";
import { Languages, History, Menu, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/hooks/useLanguage";

interface AppMenuProps {
  historyCount: number;
  showHistory: boolean;
  onToggleHistory: () => void;
}

const AppMenu = ({ historyCount, showHistory, onToggleHistory }: AppMenuProps) => {
  const { language, setLanguage, t, isRTL } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 glass hover:bg-primary/20 transition-colors"
        >
          <Menu className="h-4 w-4" />
          <span>{isRTL ? "القائمة" : "Menu"}</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={isRTL ? "start" : "end"} className="w-48">
        {/* Language Options */}
        <DropdownMenuItem
          onClick={() => setLanguage("en")}
          className={`gap-2 cursor-pointer ${language === "en" ? "bg-primary/10" : ""}`}
        >
          <Languages className="h-4 w-4" />
          <span>English</span>
          {language === "en" && <span className="mr-auto text-primary">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLanguage("ar")}
          className={`gap-2 cursor-pointer ${language === "ar" ? "bg-primary/10" : ""}`}
        >
          <Languages className="h-4 w-4" />
          <span>العربية</span>
          {language === "ar" && <span className="mr-auto text-primary">✓</span>}
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {/* History Toggle */}
        <DropdownMenuItem
          onClick={onToggleHistory}
          className="gap-2 cursor-pointer"
        >
          <History className="h-4 w-4" />
          <span>{showHistory ? t.hideHistory : t.showHistory}</span>
          {historyCount > 0 && (
            <span className="mr-auto bg-primary/20 text-primary px-2 py-0.5 rounded-full text-xs">
              {historyCount}
            </span>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AppMenu;
