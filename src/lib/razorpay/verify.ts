import crypto from 'crypto'

/**
 * Timing-safe HMAC comparison to prevent side-channel attacks.
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b))
}

/**
 * Verify Razorpay payment signature after checkout modal.
 * For orders: HMAC_SHA256(order_id + "|" + payment_id, key_secret)
 */
export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string,
): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET
  if (!secret) throw new Error('RAZORPAY_KEY_SECRET not configured')

  const body = `${orderId}|${paymentId}`
  const expected = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex')

  return timingSafeEqual(expected, signature)
}

/**
 * Verify Razorpay subscription signature after checkout modal.
 * For subscriptions: HMAC_SHA256(payment_id + "|" + subscription_id, key_secret)
 */
export function verifySubscriptionSignature(
  paymentId: string,
  subscriptionId: string,
  signature: string,
): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET
  if (!secret) throw new Error('RAZORPAY_KEY_SECRET not configured')

  const body = `${paymentId}|${subscriptionId}`
  const expected = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex')

  return timingSafeEqual(expected, signature)
}

/**
 * Verify Razorpay webhook signature.
 * HMAC_SHA256(request_body, webhook_secret)
 */
export function verifyWebhookSignature(
  body: string,
  signature: string,
): boolean {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET
  if (!webhookSecret) throw new Error('RAZORPAY_WEBHOOK_SECRET not configured')

  const expected = crypto
    .createHmac('sha256', webhookSecret)
    .update(body)
    .digest('hex')

  return timingSafeEqual(expected, signature)
}
