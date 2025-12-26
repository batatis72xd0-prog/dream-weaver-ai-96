import { useState } from "react";
import { Languages, History, Menu, ChevronDown, LogIn, LogOut, Sun, Moon, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { toast } from "sonner";

interface AppMenuProps {
  historyCount?: number;
}

const AppMenu = ({ historyCount }: AppMenuProps) => {
  const { language, setLanguage, isRTL } = useLanguage();
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogout = async () => {
    await signOut();
    toast.success(isRTL ? "تم تسجيل الخروج" : "Logged out successfully");
    setShowLogoutDialog(false);
  };

  return (
    <>
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
          {/* Auth Options */}
          {user ? (
            <DropdownMenuItem
              onClick={() => setShowLogoutDialog(true)}
              className="gap-2 cursor-pointer text-destructive"
            >
              <LogOut className="h-4 w-4" />
              <span>{isRTL ? "تسجيل الخروج" : "Log Out"}</span>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() => navigate("/auth")}
              className="gap-2 cursor-pointer"
            >
              <LogIn className="h-4 w-4" />
              <span>{isRTL ? "تسجيل الدخول" : "Log In"}</span>
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          {/* History - only for logged in users */}
          {user && (
            <>
              <DropdownMenuItem
                onClick={() => navigate("/history")}
                className="gap-2 cursor-pointer"
              >
                <History className="h-4 w-4" />
                <span>{isRTL ? "السجل" : "History"}</span>
                {historyCount && historyCount > 0 && (
                  <span className={`${isRTL ? "mr-auto" : "ml-auto"} bg-primary/20 text-primary px-2 py-0.5 rounded-full text-xs`}>
                    {historyCount}
                  </span>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}

          {/* Theme Toggle */}
          <DropdownMenuItem
            onClick={toggleTheme}
            className="gap-2 cursor-pointer"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            <span>{theme === "dark" ? (isRTL ? "الوضع النهاري" : "Light Mode") : (isRTL ? "الوضع الليلي" : "Dark Mode")}</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Language Options */}
          <DropdownMenuItem
            onClick={() => setLanguage("en")}
            className={`gap-2 cursor-pointer ${language === "en" ? "bg-primary/10" : ""}`}
          >
            <Languages className="h-4 w-4" />
            <span>English</span>
            {language === "en" && <span className={`${isRTL ? "mr-auto" : "ml-auto"} text-primary`}>✓</span>}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setLanguage("ar")}
            className={`gap-2 cursor-pointer ${language === "ar" ? "bg-primary/10" : ""}`}
          >
            <Languages className="h-4 w-4" />
            <span>العربية</span>
            {language === "ar" && <span className={`${isRTL ? "mr-auto" : "ml-auto"} text-primary`}>✓</span>}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isRTL ? "تأكيد تسجيل الخروج" : "Confirm Logout"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isRTL ? "هل أنت متأكد أنك تريد تسجيل الخروج؟" : "Are you sure you want to log out?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {isRTL ? "إلغاء" : "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {isRTL ? "تسجيل الخروج" : "Log Out"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AppMenu;
