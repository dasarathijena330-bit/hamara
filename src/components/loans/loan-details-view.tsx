"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  ArrowLeft, 
  Edit2, 
  CheckCircle, 
  Bell, 
  Calendar,
  DollarSign,
  Percent,
  TrendingUp,
  Clock,
  Target,
  Activity,
  Loader2
} from "lucide-react"
import { toast } from "sonner"

interface Loan {
  id: number
  borrowerName: string
  amount: number
  interestRate: number
  startDate: string
  notes?: string
  status: "active" | "completed" | "overdue"
  createdAt: string
  updatedAt: string
}

interface LoanDetailsViewProps {
  loanId: string
  onBack: () => void
  onEdit: (loanId: string) => void
  onMarkPaid: (loanId: string) => void
  onSendReminder: (loanId: string) => void
}

export default function LoanDetailsView({
  loanId,
  onBack,
  onEdit,
  onMarkPaid,
  onSendReminder
}: LoanDetailsViewProps) {
  const [loan, setLoan] = useState<Loan | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (loanId) {
      fetchLoanDetails()
    }
  }, [loanId])

  const fetchLoanDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/loans?id=${loanId}`)
      if (!response.ok) throw new Error('Failed to fetch loan details')
      
      const loanData = await response.json()
      setLoan(loanData)
    } catch (error) {
      console.error('Error fetching loan details:', error)
      toast.error('Failed to load loan details')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkPaid = async () => {
    if (!loan) return
    
    try {
      setUpdating(true)
      await onMarkPaid(loan.id.toString())
      
      // Update local state
      setLoan(prev => prev ? { ...prev, status: 'completed' } : null)
      toast.success('Loan marked as completed!')
    } catch (error) {
      console.error('Error marking loan as paid:', error)
      toast.error('Failed to mark loan as paid')
    } finally {
      setUpdating(false)
    }
  }

  const handleSendReminder = () => {
    if (!loan) return
    onSendReminder(loan.id.toString())
    toast.success('Reminder sent successfully!')
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      case 'completed': return 'bg-green-500/20 text-green-300 border-green-500/30'
      case 'overdue': return 'bg-red-500/20 text-red-300 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
  }

  const calculateProgress = () => {
    if (!loan) return 0
    const startDate = new Date(loan.startDate)
    const currentDate = new Date()
    const totalDuration = 365 // 1 year in days
    const daysPassed = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    return Math.min((daysPassed / totalDuration) * 100, 100)
  }

  const calculateEMI = () => {
    if (!loan) return 0
    const principal = loan.amount
    const rate = loan.interestRate / 100 / 12
    const tenure = 12 // 12 months
    
    if (rate > 0) {
      const emi = (principal * rate * Math.pow(1 + rate, tenure)) / 
                  (Math.pow(1 + rate, tenure) - 1)
      return emi
    }
    return principal / tenure
  }

  const calculateTotalPayable = () => {
    if (!loan) return 0
    return loan.amount + (loan.amount * loan.interestRate / 100)
  }

  if (loading) {
    return (
      <div className="min-h-screen p-4 md:p-6 lg:p-8">
        <Card className="glass-card rounded-3xl border-0 p-8">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted">Loading loan details...</p>
          </div>
        </Card>
      </div>
    )
  }

  if (!loan) {
    return (
      <div className="min-h-screen p-4 md:p-6 lg:p-8 flex items-center justify-center">
        <Card className="glass-card rounded-3xl border-0 p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Loan Not Found</h2>
          <p className="text-muted mb-4">The requested loan could not be found.</p>
          <Button onClick={onBack} className="neuro-btn">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="glass-card rounded-3xl p-6 md:p-8 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="neuro-btn text-muted hover:text-foreground p-2 rounded-xl"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-glow">
                {loan.borrowerName}
              </h1>
              <p className="text-lg text-muted">
                Loan ID: #{loan.id}
              </p>
            </div>
          </div>
          <Badge className={`${getStatusColor(loan.status)} border text-sm px-3 py-1`}>
            {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-4">
          <Button
            onClick={() => onEdit(loan.id.toString())}
            className="neuro-btn bg-primary/20 text-primary hover:bg-primary/30 border-primary/30"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Loan
          </Button>
          
          {loan.status === 'active' && (
            <Button
              onClick={handleMarkPaid}
              disabled={updating}
              className="neuro-btn bg-green-500/20 text-green-300 hover:bg-green-500/30 border-green-500/30"
            >
              {updating ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <CheckCircle className="w-4 h-4 mr-2" />
              )}
              Mark as Completed
            </Button>
          )}
          
          <Button
            onClick={handleSendReminder}
            className="neuro-btn bg-accent/20 text-accent hover:bg-accent/30 border-accent/30"
          >
            <Bell className="w-4 h-4 mr-2" />
            Send Reminder
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Loan Overview */}
            <Card className="glass-card rounded-2xl border-0">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-glow flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Loan Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass-card rounded-xl p-4 hover:scale-105 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted">Principal Amount</p>
                        <p className="text-xl font-bold number-glow">{formatCurrency(loan.amount)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card rounded-xl p-4 hover:scale-105 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-secondary/20 rounded-xl flex items-center justify-center">
                        <Percent className="w-5 h-5 text-secondary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted">Interest Rate</p>
                        <p className="text-xl font-bold number-glow">{loan.interestRate}% p.a.</p>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card rounded-xl p-4 hover:scale-105 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm text-muted">Monthly EMI</p>
                        <p className="text-xl font-bold number-glow text-accent">
                          {formatCurrency(calculateEMI())}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card rounded-xl p-4 hover:scale-105 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm text-muted">Total Payable</p>
                        <p className="text-xl font-bold number-glow text-green-400">
                          {formatCurrency(calculateTotalPayable())}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Repayment Progress */}
            <Card className="glass-card rounded-2xl border-0">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-glow flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Repayment Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted">Progress</span>
                    <span className="font-semibold">{calculateProgress().toFixed(1)}%</span>
                  </div>
                  <Progress 
                    value={calculateProgress()} 
                    className="h-3 progress-glow bg-surface/50"
                  />
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="glass-card rounded-xl p-4 text-center">
                      <p className="text-sm text-muted mb-1">Days Passed</p>
                      <p className="text-lg font-bold">
                        {Math.floor((new Date().getTime() - new Date(loan.startDate).getTime()) / (1000 * 60 * 60 * 24))}
                      </p>
                    </div>
                    <div className="glass-card rounded-xl p-4 text-center">
                      <p className="text-sm text-muted mb-1">Days Remaining</p>
                      <p className="text-lg font-bold">
                        {Math.max(0, 365 - Math.floor((new Date().getTime() - new Date(loan.startDate).getTime()) / (1000 * 60 * 60 * 24)))}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            {loan.notes && (
              <Card className="glass-card rounded-2xl border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold text-glow">Additional Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="glass-card rounded-xl p-4">
                    <p className="text-muted whitespace-pre-wrap">{loan.notes}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Timeline */}
            <Card className="glass-card rounded-2xl border-0">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-glow flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="glass-card rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Loan Started</p>
                      <p className="text-sm text-muted">{formatDate(loan.startDate)}</p>
                    </div>
                  </div>
                </div>

                <div className="glass-card rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                      <Clock className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <p className="font-semibold">Last Updated</p>
                      <p className="text-sm text-muted">{formatDate(loan.updatedAt)}</p>
                    </div>
                  </div>
                </div>

                {loan.status === 'completed' && (
                  <div className="glass-card rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      </div>
                      <div>
                        <p className="font-semibold">Completed</p>
                        <p className="text-sm text-muted">{formatDate(loan.updatedAt)}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="glass-card rounded-2xl border-0">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-glow">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted">Total Interest</span>
                  <span className="font-semibold">
                    {formatCurrency(loan.amount * loan.interestRate / 100)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted">Monthly Payment</span>
                  <span className="font-semibold text-accent">
                    {formatCurrency(calculateEMI())}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted">Loan Duration</span>
                  <span className="font-semibold">12 months</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted">Status</span>
                  <Badge className={`${getStatusColor(loan.status)} border text-xs`}>
                    {loan.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}