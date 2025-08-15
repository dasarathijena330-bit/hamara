"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Plus, 
  Search, 
  Eye, 
  Edit2, 
  Trash2, 
  TrendingUp, 
  AlertCircle,
  Calendar,
  Wallet,
  Target,
  Activity,
  Database
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

interface DashboardProps {
  onViewLoan: (loanId: number) => void
  onEditLoan: (loanId: number) => void
  onAddLoan: () => void
}

export default function LoanOverviewDashboard({ onViewLoan, onEditLoan, onAddLoan }: DashboardProps) {
  const [loans, setLoans] = useState<Loan[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("createdAt")

  useEffect(() => {
    fetchLoans()
  }, [searchTerm, statusFilter, sortBy])

  const fetchLoans = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (statusFilter !== 'all') params.append('status', statusFilter)
      params.append('sort', sortBy)
      params.append('order', 'desc')

      const response = await fetch(`/api/loans?${params}`)
      if (!response.ok) {
        // If API fails, just show empty state
        setLoans([])
        return
      }
      
      const data = await response.json()
      setLoans(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching loans:', error)
      setLoans([]) // Show empty state on error
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this loan?')) return

    try {
      const response = await fetch(`/api/loans?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete loan')
      
      toast.success('Loan deleted successfully')
      fetchLoans()
    } catch (error) {
      console.error('Error deleting loan:', error)
      toast.error('Failed to delete loan')
    }
  }

  // Calculate metrics
  const totalAmount = loans.reduce((sum, loan) => sum + loan.amount, 0)
  const activeLoans = loans.filter(loan => loan.status === 'active')
  const completedLoans = loans.filter(loan => loan.status === 'completed')
  const overdueLoans = loans.filter(loan => loan.status === 'overdue')
  const avgInterestRate = loans.length > 0 
    ? loans.reduce((sum, loan) => sum + loan.interestRate, 0) / loans.length 
    : 0

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      case 'completed': return 'bg-green-500/20 text-green-300 border-green-500/30'
      case 'overdue': return 'bg-red-500/20 text-red-300 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      {/* Header with database icon */}
      <div className="glass-card rounded-3xl p-6 md:p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-4 right-4 w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center">
          <Database className="w-8 h-8 text-primary" />
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-glow mb-2">
            Loan Dashboard
          </h1>
          <p className="text-lg md:text-xl text-muted mb-6">
            Manage your loans with futuristic precision
          </p>
          <Button onClick={onAddLoan} className="neuro-btn text-white font-semibold px-6 py-3 rounded-2xl">
            <Plus className="w-5 h-5 mr-2" />
            Add New Loan
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="glass-card rounded-2xl border-0 hover:scale-105 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Wallet className="w-8 h-8 text-primary" />
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted">Total Portfolio</p>
              <p className="text-2xl md:text-3xl font-bold number-glow">
                {formatCurrency(totalAmount)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card rounded-2xl border-0 hover:scale-105 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Activity className="w-8 h-8 text-accent" />
              <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-accent" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted">Active Loans</p>
              <p className="text-2xl md:text-3xl font-bold number-glow">
                {activeLoans.length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card rounded-2xl border-0 hover:scale-105 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-8 h-8 text-secondary" />
              <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-secondary" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted">Overdue</p>
              <p className="text-2xl md:text-3xl font-bold number-glow text-red-400">
                {overdueLoans.length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card rounded-2xl border-0 hover:scale-105 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-green-400" />
              <div className="w-12 h-12 bg-green-400/20 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-green-400" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted">Avg Interest</p>
              <p className="text-2xl md:text-3xl font-bold number-glow text-green-400">
                {avgInterestRate.toFixed(1)}%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="glass-card rounded-2xl border-0 mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted w-4 h-4" />
              <Input
                placeholder="Search by borrower name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 neuro-btn bg-surface/50 border-border/50 text-foreground placeholder:text-muted"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 neuro-btn bg-surface/50 border-border/50">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="glass-card border-border/50">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48 neuro-btn bg-surface/50 border-border/50">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="glass-card border-border/50">
                <SelectItem value="createdAt">Date Created</SelectItem>
                <SelectItem value="amount">Amount</SelectItem>
                <SelectItem value="borrowerName">Borrower Name</SelectItem>
                <SelectItem value="interestRate">Interest Rate</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Loans Table */}
      <Card className="glass-card rounded-2xl border-0">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-glow">Loan Portfolio</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4">
                  <Skeleton className="h-12 w-12 rounded-xl bg-surface/50" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/4 bg-surface/50" />
                    <Skeleton className="h-4 w-1/2 bg-surface/50" />
                  </div>
                </div>
              ))}
            </div>
          ) : loans.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-surface/50 rounded-2xl flex items-center justify-center">
                <Wallet className="w-12 h-12 text-muted" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No loans found</h3>
              <p className="text-muted mb-4">Start by adding your first loan to track your portfolio</p>
              <Button onClick={onAddLoan} className="neuro-btn text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Loan
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {loans.map((loan) => (
                <div key={loan.id} className="glass-card rounded-xl p-4 hover:scale-[1.02] transition-all duration-300">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg truncate">{loan.borrowerName}</h3>
                          <p className="text-sm text-muted">
                            Started {new Date(loan.startDate).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge className={`${getStatusColor(loan.status)} border`}>
                          {loan.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted">Amount</p>
                          <p className="font-semibold text-lg number-glow">
                            {formatCurrency(loan.amount)}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted">Interest Rate</p>
                          <p className="font-semibold">{loan.interestRate}%</p>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                          <p className="text-muted">Monthly EMI</p>
                          <p className="font-semibold">
                            {formatCurrency(loan.amount * 0.05)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 md:flex-col">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewLoan(loan.id)}
                        className="neuro-btn text-accent hover:text-accent"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditLoan(loan.id)}
                        className="neuro-btn text-primary hover:text-primary"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(loan.id)}
                        className="neuro-btn text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}