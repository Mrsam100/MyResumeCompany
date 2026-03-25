'use client'

import { useCallback, useRef } from 'react'

declare global {
  interface Window {
    Razorpay: new (options: RazorpayCheckoutOptions) => RazorpayInstance
  }
}

interface RazorpayCheckoutOptions {
  key: string
  amount?: number
  currency?: string
  name?: string
  description?: string
  order_id?: string
  subscription_id?: string
  handler?: (response: RazorpayResponse) => void
  prefill?: { name?: string; email?: string; contact?: string }
  theme?: { color?: string }
  modal?: { ondismiss?: () => void; escape?: boolean; confirm_close?: boolean }
  notes?: Record<string, string>
}

interface RazorpayInstance {
  open(): void
  close(): void
  on(event: string, handler: (response: unknown) => void): void
}

export interface RazorpayResponse {
  razorpay_payment_id: string
  razorpay_order_id?: string
  razorpay_subscription_id?: string
  razorpay_signature: string
}

/**
 * Hook to load Razorpay checkout script and open the payment modal.
 */
export function useRazorpay() {
  const scriptLoaded = useRef(false)

  const loadScript = useCallback((): Promise<boolean> => {
    return new Promise((resolve) => {
      if (scriptLoaded.current && window.Razorpay) {
        resolve(true)
        return
      }
      if (document.getElementById('razorpay-checkout-script')) {
        scriptLoaded.current = true
        resolve(true)
        return
      }
      const script = document.createElement('script')
      script.id = 'razorpay-checkout-script'
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.async = true
      script.onload = () => {
        scriptLoaded.current = true
        resolve(true)
      }
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }, [])

  const openCheckout = useCallback(
    async (
      options: Omit<RazorpayCheckoutOptions, 'key' | 'handler' | 'modal'>,
    ): Promise<RazorpayResponse> => {
      const loaded = await loadScript()
      if (!loaded) throw new Error('Failed to load Razorpay checkout script')

      const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
      if (!keyId) throw new Error('NEXT_PUBLIC_RAZORPAY_KEY_ID not configured')

      return new Promise<RazorpayResponse>((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: keyId,
          ...options,
          handler: (response: RazorpayResponse) => resolve(response),
          modal: {
            ondismiss: () => reject(new Error('Payment cancelled')),
            escape: true,
            confirm_close: true,
          },
        })
        rzp.open()
      })
    },
    [loadScript],
  )

  return { openCheckout }
}
