import Razorpay from 'razorpay'

let _razorpay: InstanceType<typeof Razorpay> | null = null

export function getRazorpay(): InstanceType<typeof Razorpay> {
  if (_razorpay) return _razorpay
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  if (!keyId || !keySecret) {
    throw new Error('RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be configured.')
  }
  _razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret })
  return _razorpay
}

export const razorpay = new Proxy({} as InstanceType<typeof Razorpay>, {
  get(_, prop) {
    return Reflect.get(getRazorpay(), prop)
  },
})
