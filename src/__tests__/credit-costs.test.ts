import { describe, it, expect } from 'vitest'
import { CREDIT_COSTS, CREDIT_PACKS, SIGNUP_CREDITS } from '@/constants/credit-costs'

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

describe('Signup Credits', () => {
  it('users get 100 credits', () => {
    expect(SIGNUP_CREDITS).toBe(100)
  })

  it('signup credits cover at least one full resume', () => {
    expect(SIGNUP_CREDITS).toBeGreaterThanOrEqual(CREDIT_COSTS.AI_FULL_RESUME)
  })
})
