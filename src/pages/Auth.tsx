import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { z } from "zod";

const emailSchema = z.string().email();
const passwordSchema = z.string().min(6);

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      toast.error(isRTL ? "البريد الإلكتروني غير صالح" : "Invalid email address");
      return;
    }

    // Validate password
    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      toast.error(isRTL ? "كلمة المرور يجب أن تكون 6 أحرف على الأقل" : "Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast.error(isRTL ? "بيانات الدخول غير صحيحة" : "Invalid login credentials");
          } else {
            toast.error(error.message);
          }
          return;
        }
        toast.success(isRTL ? "تم تسجيل الدخول بنجاح!" : "Logged in successfully!");
        navigate("/");
      } else {
        const { error } = await signUp(email, password);
        if (error) {
          if (error.message.includes("User already registered")) {
            toast.error(isRTL ? "هذا البريد مسجل بالفعل" : "This email is already registered");
          } else {
            toast.error(error.message);
          }
          return;
        }
        toast.success(isRTL ? "تم إنشاء الحساب بنجاح!" : "Account created successfully!");
        navigate("/");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "-3s" }} />
      </div>

      <div className="relative w-full max-w-md">
        <div className="glass rounded-2xl p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-8 w-8 text-primary" />
              <span className="text-3xl font-bold text-gradient">{t.appName}</span>
            </div>
            <h1 className="text-2xl font-semibold text-foreground">
              {isLogin 
                ? (isRTL ? "تسجيل الدخول" : "Log In") 
                : (isRTL ? "إنشاء حساب" : "Sign Up")}
            </h1>
            <p className="text-muted-foreground">
              {isLogin 
                ? (isRTL ? "أدخل بياناتك للوصول لحسابك" : "Enter your credentials to access your account")
                : (isRTL ? "أنشئ حساباً جديداً للبدء" : "Create a new account to get started")}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground`} />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isRTL ? "البريد الإلكتروني" : "Email"}
                className={`${isRTL ? "pr-10" : "pl-10"} h-12 bg-background/50`}
                disabled={isLoading}
              />
            </div>

            <div className="relative">
              <Lock className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground`} />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isRTL ? "كلمة المرور" : "Password"}
                className={`${isRTL ? "pr-10" : "pl-10"} h-12 bg-background/50`}
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-semibold"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : isLogin ? (
                isRTL ? "تسجيل الدخول" : "Log In"
              ) : (
                isRTL ? "إنشاء حساب" : "Sign Up"
              )}
            </Button>
          </form>

          {/* Toggle */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {isLogin 
                ? (isRTL ? "ليس لديك حساب؟ أنشئ واحداً" : "Don't have an account? Sign up")
                : (isRTL ? "لديك حساب بالفعل؟ سجل دخولك" : "Already have an account? Log in")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
