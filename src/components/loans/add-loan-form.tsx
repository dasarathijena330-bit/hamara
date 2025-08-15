"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Loader2, DollarSign, Percent, Calendar, User, FileText } from "lucide-react"
import { toast } from "sonner"

interface AddLoanFormProps {
  loanId?: string
  onSuccess: () => void
  onCancel: () => void
}

interface LoanFormData {
  borrowerName: string
  amount: string
  interestRate: string
  startDate: string
  notes: string
}

export default function AddLoanForm({ loanId, onSuccess, onCancel }: AddLoanFormProps) {
  const [formData, setFormData] = useState<LoanFormData>({
    borrowerName: "",
    amount: "",
    interestRate: "",
    startDate: "",
    notes: ""
  })
  const [loading, setLoading] = useState(false)
  const [loadingLoan, setLoadingLoan] = useState(false)
  const [errors, setErrors] = useState<Partial<LoanFormData>>({})

  const isEditing = Boolean(loanId)

  // Load loan data for editing
  useEffect(() => {
    if (loanId) {
      loadLoanData()
    }
  }, [loanId])

  const loadLoanData = async () => {
    if (!loanId) return

    try {
      setLoadingLoan(true)
      const response = await fetch(`/api/loans?id=${loanId}`)
      if (!response.ok) throw new Error('Failed to fetch loan')
      
      const loan = await response.json()
      setFormData({
        borrowerName: loan.borrowerName || "",
        amount: loan.amount?.toString() || "",
        interestRate: loan.interestRate?.toString() || "",
        startDate: loan.startDate ? new Date(loan.startDate).toISOString().split('T')[0] : "",
        notes: loan.notes || ""
      })
    } catch (error) {
      console.error('Error loading loan:', error)
      toast.error('Failed to load loan data')
    } finally {
      setLoadingLoan(false)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<LoanFormData> = {}

    if (!formData.borrowerName.trim()) {
      newErrors.borrowerName = "Borrower name is required"
    }

    const amount = parseFloat(formData.amount)
    if (!formData.amount || isNaN(amount) || amount <= 0) {
      newErrors.amount = "Valid amount is required"
    }

    const interestRate = parseFloat(formData.interestRate)
    if (!formData.interestRate || isNaN(interestRate) || interestRate < 0) {
      newErrors.interestRate = "Valid interest rate is required"
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error("Please fix the form errors")
      return
    }

    setLoading(true)

    try {
      const payload = {
        borrowerName: formData.borrowerName.trim(),
        amount: parseFloat(formData.amount),
        interestRate: parseFloat(formData.interestRate),
        startDate: formData.startDate,
        notes: formData.notes.trim() || null,
        status: "active" as const
      }

      const url = isEditing ? `/api/loans?id=${loanId}` : '/api/loans'
      const method = isEditing ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to save loan')
      }

      toast.success(isEditing ? 'Loan updated successfully!' : 'Loan created successfully!')
      onSuccess()
    } catch (error) {
      console.error('Error saving loan:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to save loan')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof LoanFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  // Calculate estimated EMI
  const calculateEMI = () => {
    const principal = parseFloat(formData.amount) || 0
    const rate = parseFloat(formData.interestRate) || 0
    const monthlyRate = rate / 100 / 12
    const tenure = 12 // Assuming 12 months for demo
    
    if (principal > 0 && rate > 0) {
      const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
                  (Math.pow(1 + monthlyRate, tenure) - 1)
      return emi
    }
    return 0
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (loadingLoan) {
    return (
      <div className="min-h-screen p-4 md:p-6 lg:p-8 flex items-center justify-center">
        <Card className="glass-card rounded-3xl border-0 p-8">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted">Loading loan data...</p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="glass-card rounded-3xl p-6 md:p-8 mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            onClick={onCancel}
            className="neuro-btn text-muted hover:text-foreground p-2 rounded-xl"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-glow">
              {isEditing ? 'Edit Loan' : 'Add New Loan'}
            </h1>
            <p className="text-lg text-muted">
              {isEditing ? 'Update loan details' : 'Create a new loan entry'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card className="glass-card rounded-2xl border-0">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-glow flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Loan Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Borrower Name */}
                  <div className="space-y-2">
                    <Label htmlFor="borrowerName" className="text-sm font-medium flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Borrower Name
                    </Label>
                    <Input
                      id="borrowerName"
                      type="text"
                      value={formData.borrowerName}
                      onChange={(e) => handleInputChange('borrowerName', e.target.value)}
                      className="neuro-btn bg-surface/50 border-border/50 text-foreground placeholder:text-muted rounded-xl h-12"
                      placeholder="Enter borrower's full name"
                    />
                    {errors.borrowerName && (
                      <p className="text-sm text-red-400">{errors.borrowerName}</p>
                    )}
                  </div>

                  {/* Amount */}
                  <div className="space-y-2">
                    <Label htmlFor="amount" className="text-sm font-medium flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Loan Amount (₹)
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      min="0"
                      step="1000"
                      value={formData.amount}
                      onChange={(e) => handleInputChange('amount', e.target.value)}
                      className="neuro-btn bg-surface/50 border-border/50 text-foreground placeholder:text-muted rounded-xl h-12"
                      placeholder="Enter loan amount"
                    />
                    {errors.amount && (
                      <p className="text-sm text-red-400">{errors.amount}</p>
                    )}
                  </div>

                  {/* Interest Rate */}
                  <div className="space-y-2">
                    <Label htmlFor="interestRate" className="text-sm font-medium flex items-center gap-2">
                      <Percent className="w-4 h-4" />
                      Interest Rate (% per annum)
                    </Label>
                    <Input
                      id="interestRate"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={formData.interestRate}
                      onChange={(e) => handleInputChange('interestRate', e.target.value)}
                      className="neuro-btn bg-surface/50 border-border/50 text-foreground placeholder:text-muted rounded-xl h-12"
                      placeholder="Enter interest rate"
                    />
                    {errors.interestRate && (
                      <p className="text-sm text-red-400">{errors.interestRate}</p>
                    )}
                  </div>

                  {/* Start Date */}
                  <div className="space-y-2">
                    <Label htmlFor="startDate" className="text-sm font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Start Date
                    </Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      className="neuro-btn bg-surface/50 border-border/50 text-foreground rounded-xl h-12"
                    />
                    {errors.startDate && (
                      <p className="text-sm text-red-400">{errors.startDate}</p>
                    )}
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-sm font-medium">
                      Additional Notes (Optional)
                    </Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      rows={3}
                      className="neuro-btn bg-surface/50 border-border/50 text-foreground placeholder:text-muted rounded-xl resize-none"
                      placeholder="Any additional information about the loan..."
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={onCancel}
                      className="neuro-btn flex-1 text-muted hover:text-foreground rounded-xl h-12"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="neuro-btn bg-gradient-to-r from-primary to-secondary text-white flex-1 rounded-xl h-12 font-semibold"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      {loading ? 'Saving...' : (isEditing ? 'Update Loan' : 'Create Loan')}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Preview */}
          <div className="lg:col-span-1">
            <Card className="glass-card rounded-2xl border-0 sticky top-8">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-glow">Loan Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="glass-card rounded-xl p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted">Principal Amount</span>
                    <span className="font-semibold number-glow">
                      {formData.amount ? formatCurrency(parseFloat(formData.amount)) : '₹0'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-muted">Interest Rate</span>
                    <span className="font-semibold">
                      {formData.interestRate || '0'}% p.a.
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-muted">Estimated Monthly EMI</span>
                    <span className="font-semibold text-accent number-glow">
                      {formatCurrency(calculateEMI())}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-muted">Total Interest (1 year)</span>
                    <span className="font-semibold text-secondary">
                      {formData.amount && formData.interestRate 
                        ? formatCurrency(parseFloat(formData.amount) * parseFloat(formData.interestRate) / 100)
                        : '₹0'
                      }
                    </span>
                  </div>
                </div>

                {formData.borrowerName && (
                  <div className="glass-card rounded-xl p-4">
                    <p className="text-sm text-muted mb-1">Borrower</p>
                    <p className="font-semibold">{formData.borrowerName}</p>
                  </div>
                )}

                {formData.startDate && (
                  <div className="glass-card rounded-xl p-4">
                    <p className="text-sm text-muted mb-1">Start Date</p>
                    <p className="font-semibold">
                      {new Date(formData.startDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}