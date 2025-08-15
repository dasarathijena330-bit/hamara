"use client"

import { useState } from "react"
import { Camera, Check, Eye, EyeOff, Lock, Shield, Trash2, Download, Moon, Sun, Bell, BellOff, CreditCard, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface UserProfileData {
  name: string
  email: string
  phone: string
  company: string
}

interface NotificationSettings {
  emailNotifications: boolean
  pushNotifications: boolean
  smsNotifications: boolean
  marketingEmails: boolean
}

interface SecuritySettings {
  twoFactorEnabled: boolean
}

export default function UserProfileSettings() {
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [currency, setCurrency] = useState("USD")
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  
  const [profileData, setProfileData] = useState<UserProfileData>({
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    phone: "+1 (555) 123-4567",
    company: "TechCorp Solutions"
  })

  const [originalData, setOriginalData] = useState<UserProfileData>(profileData)

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    marketingEmails: false
  })

  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactorEnabled: true
  })

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  })

  const handleEdit = () => {
    setIsEditing(true)
    setOriginalData(profileData)
  }

  const handleSave = async () => {
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsEditing(false)
    setIsLoading(false)
    toast.success("Profile updated successfully")
  }

  const handleCancel = () => {
    setProfileData(originalData)
    setIsEditing(false)
  }

  const handleNotificationChange = (key: keyof NotificationSettings, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }))
    toast.success("Notification preferences updated")
  }

  const handleThemeChange = (newTheme: "light" | "dark") => {
    setTheme(newTheme)
    toast.success(`Switched to ${newTheme} theme`)
  }

  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency)
    toast.success(`Currency changed to ${newCurrency}`)
  }

  const handleTwoFactorToggle = (enabled: boolean) => {
    setSecurity(prev => ({ ...prev, twoFactorEnabled: enabled }))
    toast.success(enabled ? "Two-factor authentication enabled" : "Two-factor authentication disabled")
  }

  const handlePasswordChange = async () => {
    if (passwords.new !== passwords.confirm) {
      toast.error("New passwords do not match")
      return
    }

    if (passwords.new.length < 8) {
      toast.error("Password must be at least 8 characters long")
      return
    }

    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsLoading(false)
    setShowPasswordDialog(false)
    setPasswords({ current: "", new: "", confirm: "" })
    toast.success("Password changed successfully")
  }

  const handleDeleteAccount = async () => {
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsLoading(false)
    setShowDeleteDialog(false)
    toast.success("Account deletion request submitted")
  }

  const handleExportData = async () => {
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsLoading(false)
    toast.success("Data export will be sent to your email")
  }

  const handlePhotoChange = () => {
    toast.success("Photo upload functionality would be implemented here")
  }

  return (
    <div className="bg-surface min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face" alt="Profile" />
                  <AvatarFallback className="text-lg font-medium">SJ</AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                  onClick={handlePhotoChange}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1 space-y-1">
                <h1 className="text-2xl font-semibold text-text-primary">{profileData.name}</h1>
                <p className="text-text-secondary">{profileData.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                    Premium Member
                  </Badge>
                  <Badge variant="outline" className="border-success text-success">
                    Verified
                  </Badge>
                </div>
              </div>
              <Button onClick={handlePhotoChange} variant="outline" className="shrink-0">
                <Camera className="h-4 w-4 mr-2" />
                Change Photo
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Account Settings */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your personal information and contact details</CardDescription>
              </div>
              {!isEditing ? (
                <Button onClick={handleEdit} variant="outline">
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={handleCancel} variant="outline" size="sm">
                    Cancel
                  </Button>
                  <Button onClick={handleSave} size="sm" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                  disabled={!isEditing}
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  disabled={!isEditing}
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                  disabled={!isEditing}
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={profileData.company}
                  onChange={(e) => setProfileData(prev => ({ ...prev, company: e.target.value }))}
                  disabled={!isEditing}
                  className="bg-background"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Customize your experience and notification settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-medium">Theme</Label>
                <p className="text-sm text-text-secondary">Choose your preferred color scheme</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={theme === "light" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleThemeChange("light")}
                  className="gap-2"
                >
                  <Sun className="h-4 w-4" />
                  Light
                </Button>
                <Button
                  variant={theme === "dark" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleThemeChange("dark")}
                  className="gap-2"
                >
                  <Moon className="h-4 w-4" />
                  Dark
                </Button>
              </div>
            </div>

            <Separator />

            {/* Currency Selection */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-medium">Currency</Label>
                <p className="text-sm text-text-secondary">Select your preferred currency</p>
              </div>
              <Select value={currency} onValueChange={handleCurrencyChange}>
                <SelectTrigger className="w-32 bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="JPY">JPY (¥)</SelectItem>
                  <SelectItem value="CAD">CAD (C$)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Notifications */}
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">Notifications</Label>
                <p className="text-sm text-text-secondary">Manage how you receive notifications</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="h-4 w-4 text-text-secondary" />
                    <div>
                      <p className="text-sm font-medium">Email Notifications</p>
                      <p className="text-xs text-text-secondary">Receive notifications via email</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) => handleNotificationChange("emailNotifications", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="h-4 w-4 text-text-secondary" />
                    <div>
                      <p className="text-sm font-medium">Push Notifications</p>
                      <p className="text-xs text-text-secondary">Receive push notifications in browser</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.pushNotifications}
                    onCheckedChange={(checked) => handleNotificationChange("pushNotifications", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BellOff className="h-4 w-4 text-text-secondary" />
                    <div>
                      <p className="text-sm font-medium">SMS Notifications</p>
                      <p className="text-xs text-text-secondary">Receive notifications via text message</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.smsNotifications}
                    onCheckedChange={(checked) => handleNotificationChange("smsNotifications", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-4 w-4 text-text-secondary" />
                    <div>
                      <p className="text-sm font-medium">Marketing Emails</p>
                      <p className="text-xs text-text-secondary">Receive promotional offers and updates</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.marketingEmails}
                    onCheckedChange={(checked) => handleNotificationChange("marketingEmails", checked)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>Manage your account security and authentication settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-medium">Password</Label>
                <p className="text-sm text-text-secondary">Change your account password</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowPasswordDialog(true)}
                className="gap-2"
              >
                <Lock className="h-4 w-4" />
                Change Password
              </Button>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-text-secondary" />
                <div>
                  <p className="text-sm font-medium">Two-Factor Authentication</p>
                  <p className="text-xs text-text-secondary">Add an extra layer of security to your account</p>
                </div>
              </div>
              <Switch
                checked={security.twoFactorEnabled}
                onCheckedChange={handleTwoFactorToggle}
              />
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
            <CardDescription>Export your data or permanently delete your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-medium">Export Data</Label>
                <p className="text-sm text-text-secondary">Download a copy of all your account data</p>
              </div>
              <Button 
                variant="outline" 
                onClick={handleExportData}
                disabled={isLoading}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                {isLoading ? "Exporting..." : "Export Data"}
              </Button>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-medium text-destructive">Delete Account</Label>
                <p className="text-sm text-text-secondary">Permanently delete your account and all associated data</p>
              </div>
              <Button 
                variant="destructive" 
                onClick={() => setShowDeleteDialog(true)}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Password Change Dialog */}
        <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
          <DialogContent className="bg-card">
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
              <DialogDescription>
                Enter your current password and choose a new secure password.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showPassword ? "text" : "password"}
                    value={passwords.current}
                    onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                    className="bg-background pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={passwords.new}
                  onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                  className="bg-background"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowPasswordDialog(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                onClick={handlePasswordChange} 
                disabled={isLoading || !passwords.current || !passwords.new || !passwords.confirm}
              >
                {isLoading ? "Changing..." : "Change Password"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Account Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent className="bg-card">
            <DialogHeader>
              <DialogTitle className="text-destructive">Delete Account</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
              </DialogDescription>
            </DialogHeader>
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Trash2 className="h-5 w-5 text-destructive mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-destructive">This will delete:</p>
                  <ul className="text-sm text-text-secondary space-y-1">
                    <li>• Your profile and account information</li>
                    <li>• All your loan data and transaction history</li>
                    <li>• Your preferences and settings</li>
                    <li>• Any uploaded documents or files</li>
                  </ul>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowDeleteDialog(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeleteAccount}
                disabled={isLoading}
              >
                {isLoading ? "Deleting..." : "Delete Account"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}