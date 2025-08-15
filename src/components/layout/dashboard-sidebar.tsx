"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  LayoutDashboard, 
  Plus, 
  User, 
  Settings, 
  LogOut,
  Sparkles,
  Shield
} from "lucide-react"

interface User {
  name: string
  email: string
}

interface DashboardSidebarProps {
  activeRoute: string
  onNavigate: (route: string) => void
  onLogout: () => void
  user: User
}

export default function DashboardSidebar({ 
  activeRoute, 
  onNavigate, 
  onLogout, 
  user 
}: DashboardSidebarProps) {
  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      route: "/dashboard",
      active: activeRoute === "/dashboard"
    },
    {
      icon: Plus,
      label: "Add Loan",
      route: "/loans/add",
      active: activeRoute === "/loans/add"
    },
    {
      icon: User,
      label: "Profile",
      route: "/profile", 
      active: activeRoute === "/profile"
    },
    {
      icon: Settings,
      label: "Settings",
      route: "/settings",
      active: activeRoute === "/settings",
      comingSoon: true
    }
  ]

  const handleNavigation = (route: string, comingSoon?: boolean) => {
    if (comingSoon) {
      // Show coming soon message
      return
    }
    onNavigate(route)
  }

  return (
    <div className="h-full glass-card rounded-r-3xl border-r-0 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-xl text-glow">LoanTracker</h1>
            <p className="text-xs text-muted">Futuristic Finance</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.route}
            variant={item.active ? "default" : "ghost"}
            className={`
              w-full justify-start text-left neuro-btn rounded-xl h-12 relative overflow-hidden
              ${item.active 
                ? 'bg-gradient-to-r from-primary/20 to-secondary/20 text-white border-primary/50' 
                : 'hover:bg-surface/50 text-muted hover:text-foreground'
              }
              ${item.comingSoon ? 'opacity-60' : ''}
            `}
            onClick={() => handleNavigation(item.route, item.comingSoon)}
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span className="flex-1">{item.label}</span>
            {item.comingSoon && (
              <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-full">
                Soon
              </span>
            )}
            {item.active && (
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl" />
            )}
          </Button>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-border/50">
        <div className="glass-card rounded-xl p-4 mb-3">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="w-10 h-10 border-2 border-primary/30">
              <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white font-semibold">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{user.name}</p>
              <p className="text-xs text-muted truncate">{user.email}</p>
            </div>
            <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
              <Shield className="w-3 h-3 text-green-400" />
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="w-full neuro-btn text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  )
}