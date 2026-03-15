import { describe, it, expect } from 'vitest'
import { CREDIT_COSTS, CREDIT_PACKS, SUBSCRIPTION_PLANS, SIGNUP_CREDITS } from '@/constants/credit-costs'

describe('Credit Costs Constants', () => {
  it('all credit costs are positive numbers', () => {
    Object.entries(CREDIT_COSTS).forEach(([key, cost]) => {
      expect(cost, `${key} should be positive`).toBeGreaterThan(0)
      expect(Number.isInteger(cost), `${key} should be integer`).toBe(true)
    })
  })

  it('has all expected AI actions', () => {
    expect(CREDIT_COSTS.AI_BULLET_POINTS).toBeDefined()
    expect(CREDIT_COSTS.AI_SUMMARY).toBeDefined()
    expect(CREDIT_COSTS.AI_FULL_RESUME).toBeDefined()
    expect(CREDIT_COSTS.AI_ATS_SCAN).toBeDefined()
    expect(CREDIT_COSTS.AI_ATS_OPTIMIZE).toBeDefined()
    expect(CREDIT_COSTS.AI_COVER_LETTER).toBeDefined()
    expect(CREDIT_COSTS.PDF_EXPORT).toBeDefined()
  })

  it('full resume costs more than individual features', () => {
    expect(CREDIT_COSTS.AI_FULL_RESUME).toBeGreaterThan(CREDIT_COSTS.AI_BULLET_POINTS)
    expect(CREDIT_COSTS.AI_FULL_RESUME).toBeGreaterThan(CREDIT_COSTS.AI_SUMMARY)
  })
})

describe('Credit Packs', () => {
  it('has 3 packs', () => {
    expect(CREDIT_PACKS).toHaveLength(3)
  })

  it('all packs have positive credits and price', () => {
    CREDIT_PACKS.forEach((pack) => {
      expect(pack.credits).toBeGreaterThan(0)
      expect(pack.price).toBeGreaterThan(0)
    })
  })

  it('larger packs have better price per credit', () => {
    const ratios = CREDIT_PACKS.map((p) => p.price / p.credits)
    for (let i = 1; i < ratios.length; i++) {
      expect(ratios[i], `Pack ${i} should be cheaper per credit than pack ${i - 1}`).toBeLessThan(ratios[i - 1])
    }
  })

  it('exactly one pack is marked popular', () => {
    const popularCount = CREDIT_PACKS.filter((p) => p.popular).length
    expect(popularCount).toBe(1)
  })
})

describe('Subscription Plans', () => {
  it('yearly is cheaper per month than monthly', () => {
    const monthlyRate = SUBSCRIPTION_PLANS.PRO_MONTHLY.price
    const yearlyMonthlyRate = SUBSCRIPTION_PLANS.PRO_YEARLY.price / 12
    expect(yearlyMonthlyRate).toBeLessThan(monthlyRate)
  })

  it('both plans give 500 credits', () => {
    expect(SUBSCRIPTION_PLANS.PRO_MONTHLY.credits).toBe(500)
    expect(SUBSCRIPTION_PLANS.PRO_YEARLY.credits).toBe(500)
  })
})

describe('Signup Credits', () => {
  it('free users get 100 credits', () => {
    expect(SIGNUP_CREDITS.FREE).toBe(100)
  })

  it('pro users get more credits than free', () => {
    expect(SIGNUP_CREDITS.PRO).toBeGreaterThan(SIGNUP_CREDITS.FREE)
  })

  it('free credits cover at least one full resume', () => {
    expect(SIGNUP_CREDITS.FREE).toBeGreaterThanOrEqual(CREDIT_COSTS.AI_FULL_RESUME)
  })
})
