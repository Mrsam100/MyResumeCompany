'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, CreditCard, Crown, User, Lock, AlertTriangle, Settings } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useCurrentUser } from '@/hooks/use-current-user'

const profileSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
})

type ProfileInput = z.infer<typeof profileSchema>

export default function SettingsPage() {
  const { user, update } = useCurrentUser()
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')

  function handleDeleteDialogChange(open: boolean) {
    setDeleteOpen(open)
    if (!open) {
      setDeleteConfirm('')
      setDeletePassword('')
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    values: { name: user?.name ?? '' },
  })

  async function onProfileUpdate(data: ProfileInput) {
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        toast.success('Profile updated')
        // (#11) Refresh session so sidebar/topbar shows new name
        await update()
      } else {
        toast.error('Failed to update profile')
      }
    } catch {
      toast.error('Something went wrong')
    }
  }

  async function handleCancelSubscription() {
    if (!confirm('Are you sure you want to cancel your Pro subscription? You will lose access to unlimited AI features.')) {
      return
    }
    try {
      const res = await fetch('/api/razorpay/subscription/cancel', { method: 'POST' })
      if (res.ok) {
        toast.success('Subscription cancelled')
        update()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to cancel subscription')
      }
    } catch {
      toast.error('Something went wrong')
    }
  }

  async function handleDeleteAccount() {
    if (deleteConfirm.trim() !== 'DELETE') return

    try {
      const res = await fetch('/api/auth/account', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: deletePassword || undefined }),
      })
      if (res.ok) {
        toast.success('Account deleted')
        signOut({ callbackUrl: '/' })
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to delete account')
      }
    } catch {
      toast.error('Something went wrong')
    }
  }

  async function handlePasswordChange() {
    if (newPassword !== confirmNewPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    setChangingPassword(true)
    try {
      const res = await fetch('/api/auth/password-change', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      if (res.ok) {
        toast.success('Password updated')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmNewPassword('')
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to change password')
      }
    } catch {
      toast.error('Something went wrong')
    } finally {
      setChangingPassword(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-6 w-6 text-muted-foreground" />
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your account and preferences</p>
        </div>
      </div>

      {/* Profile */}
      <Card className="border-l-[3px] border-l-primary hover:shadow-sm transition-shadow duration-200 animate-fade-in-up" style={{ animationDelay: '0ms' }}>
        <CardHeader>
          <CardTitle><User className="inline h-4 w-4 text-muted-foreground mr-2" />Profile</CardTitle>
          <CardDescription>Your personal information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onProfileUpdate)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register('name')} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user?.email ?? ''} disabled />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save changes
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Subscription */}
      <Card className="border-l-[3px] border-l-amber-500 hover:shadow-sm transition-shadow duration-200 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <CardHeader>
          <CardTitle><CreditCard className="inline h-4 w-4 text-muted-foreground mr-2" />Subscription</CardTitle>
          <CardDescription>Your current plan and billing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Current Plan</p>
              <p className="text-sm text-muted-foreground">
                {user?.subscriptionTier === 'PRO'
                  ? 'Unlimited AI + 500 credits/month'
                  : 'Free tier with credit-based usage'}
              </p>
            </div>
            <Badge
              variant={user?.subscriptionTier === 'PRO' ? 'default' : 'secondary'}
              className={user?.subscriptionTier === 'PRO' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' : ''}
            >
              {user?.subscriptionTier === 'PRO' && <Crown className="mr-1 h-3 w-3" />}
              {user?.subscriptionTier ?? 'FREE'}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            {user?.subscriptionTier === 'PRO' ? (
              <Button variant="outline" className="gap-2 text-destructive hover:text-destructive" onClick={handleCancelSubscription}>
                <CreditCard className="h-4 w-4" />
                Cancel Subscription
              </Button>
            ) : (
              <Link href="/credits">
                <Button variant="outline" className="gap-2">
                  <Crown className="h-4 w-4" />
                  Upgrade to Pro
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Password Change — only for email/password accounts */}
      {user?.hasPassword && (
        <Card className="border-l-[3px] border-l-blue-500 hover:shadow-sm transition-shadow duration-200 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <CardHeader>
            <CardTitle><Lock className="inline h-4 w-4 text-muted-foreground mr-2" />Password</CardTitle>
            <CardDescription>Change your account password</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmNewPassword">Confirm new password</Label>
              <Input
                id="confirmNewPassword"
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>
            <Button
              onClick={handlePasswordChange}
              disabled={changingPassword || !currentPassword || !newPassword}
            >
              {changingPassword ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Update password
            </Button>
          </CardContent>
        </Card>
      )}

      <Separator />

      {/* Danger Zone */}
      <Card className="border-destructive/50 border-l-[3px] border-l-destructive bg-gradient-to-br from-destructive/3 to-transparent hover:shadow-sm transition-shadow duration-200 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
        <CardHeader>
          <CardTitle className="text-destructive"><AlertTriangle className="inline h-4 w-4 text-destructive mr-2" />Danger Zone</CardTitle>
          <CardDescription>Irreversible actions on your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={() => setDeleteOpen(true)} className="hover:shadow-[0_0_20px_oklch(0.577_0.245_27.325/15%)]">
            Delete Account
          </Button>
          <Dialog open={deleteOpen} onOpenChange={handleDeleteDialogChange}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete your account?</DialogTitle>
                <DialogDescription>
                  This will permanently delete your account, all resumes, and all data. This action
                  cannot be undone. Type <strong>DELETE</strong> to confirm.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                {user?.hasPassword && (
                  <Input
                    type="password"
                    placeholder="Enter your password to confirm"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    autoComplete="current-password"
                  />
                )}
                <Input
                  placeholder="Type DELETE to confirm"
                  value={deleteConfirm}
                  onChange={(e) => setDeleteConfirm(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirm.trim() !== 'DELETE'}
                >
                  Delete my account
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  )
}
