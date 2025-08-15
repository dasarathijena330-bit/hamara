"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

// Import components directly for faster loading
import GoogleSignInForm from "@/components/auth/google-signin-form"
import LoanOverviewDashboard from "@/components/dashboard/loan-overview-dashboard"
import AddLoanForm from "@/components/loans/add-loan-form"
import LoanDetailsView from "@/components/loans/loan-details-view"
import DashboardSidebar from "@/components/layout/dashboard-sidebar"
import UserProfileSettings from "@/components/profile/user-profile-settings"

type AppView = "login" | "dashboard" | "add-loan" | "loan-details" | "profile"

export default function Page() {
  const [currentView, setCurrentView] = useState<AppView>("login")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [selectedLoanId, setSelectedLoanId] = useState<string>("")
  const [editingLoanId, setEditingLoanId] = useState<string>("")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSignIn = () => {
    setIsAuthenticated(true)
    setCurrentView("dashboard")
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setCurrentView("login")
    setSidebarOpen(false)
  }

  const handleNavigate = (route: string) => {
    switch (route) {
      case "/dashboard":
        setCurrentView("dashboard")
        break
      case "/loans/add":
        setCurrentView("add-loan")
        setEditingLoanId("") // Clear editing mode
        break
      case "/profile":
        setCurrentView("profile")
        break
      default:
        setCurrentView("dashboard")
    }
    setSidebarOpen(false) // Close sidebar on mobile after navigation
  }

  const handleViewLoanDetails = (loanId: number) => {
    setSelectedLoanId(loanId.toString())
    setCurrentView("loan-details")
    setSidebarOpen(false)
  }

  const handleEditLoan = (loanId: number) => {
    setEditingLoanId(loanId.toString())
    setCurrentView("add-loan")
    setSidebarOpen(false)
  }

  const handleMarkPaid = async (loanId: string) => {
    try {
      const response = await fetch(`/api/loans?id=${loanId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'completed' }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to mark loan as paid')
      }
      
      // Handle success (could show toast here)
      console.log("Loan marked as paid:", loanId)
    } catch (error) {
      console.error("Error marking loan as paid:", error)
    }
  }

  const handleSendReminder = (loanId: string) => {
    // Handle send reminder logic
    console.log("Sending reminder for loan:", loanId)
  }

  const handleBackFromDetails = () => {
    setCurrentView("dashboard")
  }

  const handleLoanFormSuccess = () => {
    setCurrentView("dashboard")
    setEditingLoanId("") // Clear editing mode
  }

  const handleLoanFormCancel = () => {
    setCurrentView("dashboard")
    setEditingLoanId("") // Clear editing mode
  }

  const handleAddLoan = () => {
    setEditingLoanId("") // Clear editing mode for new loan
    setCurrentView("add-loan")
    setSidebarOpen(false)
  }

  const getActiveRoute = () => {
    switch (currentView) {
      case "dashboard":
        return "/dashboard"
      case "add-loan":
        return "/loans/add"
      case "profile":
        return "/profile"
      default:
        return "/dashboard"
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        {/* Simplified background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-600" />
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse" />
        
        <div className="relative z-10">
          <GoogleSignInForm onSignIn={handleSignIn} />
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen relative overflow-hidden">
      {/* Simplified background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-600" />
      <div className="absolute inset-0 bg-black/20" />

      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-white/10 backdrop-blur border-white/20 text-white hover:bg-white/20"
        >
          {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40 w-[280px] 
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <DashboardSidebar
          activeRoute={getActiveRoute()}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          user={{
            name: "John Doe",
            email: "john.doe@example.com"
          }}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden lg:ml-0 relative">
        <div className="h-full overflow-y-auto">
          {currentView === "dashboard" && (
            <LoanOverviewDashboard 
              onViewLoan={handleViewLoanDetails}
              onEditLoan={handleEditLoan}
              onAddLoan={handleAddLoan}
            />
          )}

          {currentView === "add-loan" && (
            <AddLoanForm 
              loanId={editingLoanId || undefined}
              onSuccess={handleLoanFormSuccess}
              onCancel={handleLoanFormCancel}
            />
          )}

          {currentView === "loan-details" && (
            <LoanDetailsView
              loanId={selectedLoanId}
              onBack={handleBackFromDetails}
              onEdit={(loanId) => handleEditLoan(parseInt(loanId))}
              onMarkPaid={handleMarkPaid}
              onSendReminder={handleSendReminder}
            />
          )}

          {currentView === "profile" && (
            <UserProfileSettings />
          )}
        </div>
      </main>
    </div>
  )
}