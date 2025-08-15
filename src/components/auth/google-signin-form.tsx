"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { 
  Mail, 
  Eye, 
  EyeOff, 
  Chrome, 
  Sparkles, 
  Shield,
  Zap,
  Loader2
} from "lucide-react"
import { toast } from "sonner"
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// TODO: Replace with your project's actual configuration object
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
const app = initializeApp(firebaseConfig);
interface GoogleSignInFormProps {
  onSignIn: () => void
}

export default function GoogleSignInForm({ onSignIn }: GoogleSignInFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error("Please enter both email and password")
      return
    }

    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Welcome back! Signed in successfully")
      onSignIn()
      setLoading(false)
    }, 1500)
  }

  const handleGoogleSignIn = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    setGoogleLoading(true)
    
    try {
      const result = await signInWithPopup(auth, provider);
      // The signed-in user info.
      const user = result.user;
      console.log("Google sign-in successful:", user);
      toast.success("Welcome! Signed in with Google")
      onSignIn()
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      toast.error(`Google sign-in failed: ${error.message}`)
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Logo/Brand */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary via-secondary to-accent rounded-3xl flex items-center justify-center shadow-2xl">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-glow mb-2">LoanTracker</h1>
        <p className="text-lg text-muted">Futuristic Finance Management</p>
      </div>

      <Card className="glass-card rounded-3xl border-0 shadow-2xl">
        <CardHeader className="pb-4 text-center">
          <CardTitle className="text-2xl font-bold text-glow flex items-center justify-center gap-2">
            <Shield className="w-6 h-6" />
            Welcome Back
          </CardTitle>
          <p className="text-muted">Sign in to access your loan dashboard</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Google Sign In */}
          <Button
            onClick={handleGoogleSignIn}
            disabled={googleLoading || loading}
            className="w-full neuro-btn bg-white/10 hover:bg-white/20 text-white border-white/20 h-14 text-lg font-semibold rounded-2xl"
          >
            {googleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin mr-3" />
            ) : (
              <Chrome className="w-5 h-5 mr-3" />
            )}
            {googleLoading ? "Connecting..." : "Continue with Google"}
          </Button>

          <div className="relative">
            <Separator className="bg-border/30" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-surface/80 px-4 py-1 rounded-full text-sm text-muted backdrop-blur">
                or sign in with email
              </span>
            </div>
          </div>

          {/* Email Sign In Form */}
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="neuro-btn bg-surface/50 border-border/50 text-foreground placeholder:text-muted rounded-xl h-12"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="neuro-btn bg-surface/50 border-border/50 text-foreground placeholder:text-muted rounded-xl h-12 pr-12"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-muted hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full neuro-btn bg-gradient-to-r from-primary to-secondary text-white h-14 text-lg font-semibold rounded-2xl mt-6"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin mr-3" />
              ) : (
                <Zap className="w-5 h-5 mr-3" />
              )}
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          {/* Features */}
          <div className="pt-4 space-y-3">
            <div className="text-center text-sm text-muted mb-4">
              Experience the future of loan management
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              <div className="glass-card rounded-xl p-3 flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Secure & Encrypted</p>
                  <p className="text-xs text-muted">Bank-level security</p>
                </div>
              </div>
              
              <div className="glass-card rounded-xl p-3 flex items-center gap-3">
                <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium">AI-Powered Insights</p>
                  <p className="text-xs text-muted">Smart recommendations</p>
                </div>
              </div>
              
              <div className="glass-card rounded-xl p-3 flex items-center gap-3">
                <div className="w-8 h-8 bg-secondary/20 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-secondary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Real-time Updates</p>
                  <p className="text-xs text-muted">Instant notifications</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center mt-8 text-sm text-muted">
        <p>Demo credentials: any email/password combination</p>
        <p className="mt-2">Built with ❤️ using Next.js 15 & Shadcn/UI</p>
      </div>
    </div>
  )
}