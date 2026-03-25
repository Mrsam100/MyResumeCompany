import {
  pgTable,
  pgEnum,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  uniqueIndex,
  index,
  primaryKey,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import type { ResumeContent } from '@/types/resume'
import type { TemplateConfig } from '@/types/template'

// ==================== ENUMS ====================

export const subscriptionTierEnum = pgEnum('subscription_tier', ['FREE', 'PRO'])

export const subscriptionStatusEnum = pgEnum('subscription_status', [
  'ACTIVE',
  'CANCELED',
  'PAST_DUE',
  'TRIALING',
])

export const creditTransactionTypeEnum = pgEnum('credit_transaction_type', [
  'SIGNUP_BONUS',
  'PURCHASE',
  'AI_BULLET_POINTS',
  'AI_SUMMARY',
  'AI_FULL_RESUME',
  'AI_ATS_SCAN',
  'AI_ATS_OPTIMIZE',
  'AI_COVER_LETTER',
  'AI_LINKEDIN_IMPORT',
  'AI_RESUME_IMPORT',
  'PDF_EXPORT',
  'DOCX_EXPORT',
  'SUBSCRIPTION_MONTHLY',
  'REFUND',
  'REFERRAL_BONUS',
  'ADMIN_ADJUSTMENT',
])

export const templateCategoryEnum = pgEnum('template_category', [
  'PROFESSIONAL',
  'MODERN',
  'CREATIVE',
  'TECH',
  'ATS_OPTIMIZED',
  'ACADEMIC',
  'MINIMAL',
])

// ==================== HELPER ====================

function cuid() {
  return nanoid(25)
}

// ==================== USERS ====================

export const users = pgTable(
  'users',
  {
    id: text('id').primaryKey().$defaultFn(cuid),
    email: text('email').notNull().unique(),
    emailVerified: timestamp('email_verified', { mode: 'date' }),
    name: text('name'),
    image: text('image'),
    hashedPassword: text('hashed_password'),
    credits: integer('credits').notNull().default(0),
    subscriptionTier: subscriptionTierEnum('subscription_tier').notNull().default('FREE'),
    referralCode: text('referral_code').unique(),
    referredBy: text('referred_by'),
    onboardingStep: integer('onboarding_step').notNull().default(0),
    lowCreditsNotifiedAt: timestamp('low_credits_notified_at', { mode: 'date' }),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
)

// ==================== ACCOUNTS (OAuth) ====================

export const accounts = pgTable(
  'accounts',
  {
    id: text('id').primaryKey().$defaultFn(cuid),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('provider_account_id').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (table) => [
    uniqueIndex('accounts_provider_account_idx').on(table.provider, table.providerAccountId),
    index('accounts_user_id_idx').on(table.userId),
  ],
)

// ==================== SESSIONS ====================

export const sessions = pgTable(
  'sessions',
  {
    sessionToken: text('session_token').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (table) => [index('sessions_user_id_idx').on(table.userId)],
)

// ==================== VERIFICATION TOKENS ====================

export const verificationTokens = pgTable(
  'verification_tokens',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull().unique(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.identifier, table.token] })],
)

// ==================== PASSWORD RESET TOKENS ====================

export const passwordResetTokens = pgTable(
  'password_reset_tokens',
  {
    id: text('id').primaryKey().$defaultFn(cuid),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    token: text('token').notNull().unique(),
    expiresAt: timestamp('expires_at', { mode: 'date' }).notNull(),
    usedAt: timestamp('used_at', { mode: 'date' }),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  },
  (table) => [
    index('password_reset_tokens_user_idx').on(table.userId),
    index('password_reset_tokens_expires_idx').on(table.expiresAt),
  ],
)

// ==================== RESUMES ====================

export const resumes = pgTable(
  'resumes',
  {
    id: text('id').primaryKey().$defaultFn(cuid),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    title: text('title').notNull().default('Untitled Resume'),
    slug: text('slug').notNull().unique().$defaultFn(cuid),
    templateId: text('template_id').notNull().default('classic-professional'),
    content: jsonb('content').notNull().$type<ResumeContent>(),
    isPublic: boolean('is_public').notNull().default(false),
    lastEditedAt: timestamp('last_edited_at', { mode: 'date' }).notNull().defaultNow(),
    thumbnailUrl: text('thumbnail_url'),
    targetJobDescription: text('target_job_description'),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index('resumes_user_id_idx').on(table.userId),
    index('resumes_user_last_edited_idx').on(table.userId, table.lastEditedAt),
  ],
)

// ==================== RESUME VERSIONS ====================

export const resumeVersions = pgTable(
  'resume_versions',
  {
    id: text('id').primaryKey().$defaultFn(cuid),
    resumeId: text('resume_id')
      .notNull()
      .references(() => resumes.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    label: text('label').notNull(),
    templateId: text('template_id').notNull(),
    content: jsonb('content').notNull().$type<ResumeContent>(),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  },
  (table) => [
    index('resume_versions_resume_idx').on(table.resumeId, table.createdAt),
  ],
)

// ==================== TEMPLATES ====================

export const templates = pgTable(
  'templates',
  {
    id: text('id').primaryKey().$defaultFn(cuid),
    name: text('name').notNull().unique(),
    slug: text('slug').notNull().unique(),
    description: text('description'),
    category: templateCategoryEnum('category').notNull(),
    thumbnail: text('thumbnail'),
    isPremium: boolean('is_premium').notNull().default(false),
    isActive: boolean('is_active').notNull().default(true),
    config: jsonb('config').notNull().$type<TemplateConfig>(),
    sortOrder: integer('sort_order').notNull().default(0),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index('templates_category_active_sort_idx').on(table.category, table.isActive, table.sortOrder),
    index('templates_active_sort_idx').on(table.isActive, table.sortOrder),
  ],
)

// ==================== CREDIT TRANSACTIONS ====================

export const creditTransactions = pgTable(
  'credit_transactions',
  {
    id: text('id').primaryKey().$defaultFn(cuid),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    amount: integer('amount').notNull(),
    type: creditTransactionTypeEnum('type').notNull(),
    description: text('description'),
    resumeId: text('resume_id').references(() => resumes.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  },
  (table) => [
    index('credit_transactions_user_created_idx').on(table.userId, table.createdAt),
    index('credit_transactions_user_type_idx').on(table.userId, table.type),
  ],
)

// ==================== SUBSCRIPTIONS ====================

export const subscriptions = pgTable('subscriptions', {
  id: text('id').primaryKey().$defaultFn(cuid),
  userId: text('user_id')
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: 'cascade' }),
  razorpaySubscriptionId: text('razorpay_subscription_id').unique(),
  razorpayPlanId: text('razorpay_plan_id'),
  status: subscriptionStatusEnum('status').notNull().default('ACTIVE'),
  currentPeriodStart: timestamp('current_period_start', { mode: 'date' }),
  currentPeriodEnd: timestamp('current_period_end', { mode: 'date' }),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
})

// ==================== COVER LETTERS ====================

export const coverLetterToneEnum = pgEnum('cover_letter_tone', [
  'professional',
  'enthusiastic',
  'conversational',
])

export const coverLetters = pgTable(
  'cover_letters',
  {
    id: text('id').primaryKey().$defaultFn(cuid),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    resumeId: text('resume_id').references(() => resumes.id, { onDelete: 'set null' }),
    title: text('title').notNull().default('Untitled Cover Letter'),
    companyName: text('company_name').notNull().default(''),
    jobTitle: text('job_title').notNull().default(''),
    tone: coverLetterToneEnum('tone').notNull().default('professional'),
    subject: text('subject'),
    content: text('content').notNull().default(''),
    templateId: text('template_id'),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index('cover_letters_user_id_idx').on(table.userId),
    index('cover_letters_user_updated_idx').on(table.userId, table.updatedAt),
  ],
)

// ==================== REFERRALS ====================

export const referrals = pgTable(
  'referrals',
  {
    id: text('id').primaryKey().$defaultFn(cuid),
    referrerId: text('referrer_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    referredId: text('referred_id')
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: 'cascade' }),
    referrerCredited: boolean('referrer_credited').notNull().default(false),
    referredCredited: boolean('referred_credited').notNull().default(false),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  },
  (table) => [
    index('referrals_referrer_idx').on(table.referrerId),
  ],
)

// ==================== NEWSLETTER SUBSCRIBERS ====================

export const newsletterSubscribers = pgTable(
  'newsletter_subscribers',
  {
    id: text('id').primaryKey().$defaultFn(cuid),
    email: text('email').notNull().unique(),
    name: text('name'),
    source: text('source').notNull().default('footer'),
    subscribedAt: timestamp('subscribed_at', { mode: 'date' }).notNull().defaultNow(),
    unsubscribedAt: timestamp('unsubscribed_at', { mode: 'date' }),
  },
)

// ==================== PAYMENT EVENTS (Webhook Idempotency) ====================

export const paymentEvents = pgTable('payment_events', {
  id: text('id').primaryKey(), // Razorpay event ID
  type: text('type').notNull(),
  processedAt: timestamp('processed_at', { mode: 'date' }).notNull().defaultNow(),
})

// ==================== RELATIONS ====================

export const usersRelations = relations(users, ({ many, one }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  resumes: many(resumes),
  creditTransactions: many(creditTransactions),
  subscription: one(subscriptions),
}))

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}))

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}))

export const resumesRelations = relations(resumes, ({ one, many }) => ({
  user: one(users, { fields: [resumes.userId], references: [users.id] }),
  creditTransactions: many(creditTransactions),
  coverLetters: many(coverLetters),
  versions: many(resumeVersions),
}))

export const resumeVersionsRelations = relations(resumeVersions, ({ one }) => ({
  resume: one(resumes, { fields: [resumeVersions.resumeId], references: [resumes.id] }),
  user: one(users, { fields: [resumeVersions.userId], references: [users.id] }),
}))

export const coverLettersRelations = relations(coverLetters, ({ one }) => ({
  user: one(users, { fields: [coverLetters.userId], references: [users.id] }),
  resume: one(resumes, { fields: [coverLetters.resumeId], references: [resumes.id] }),
}))

export const creditTransactionsRelations = relations(creditTransactions, ({ one }) => ({
  user: one(users, { fields: [creditTransactions.userId], references: [users.id] }),
  resume: one(resumes, { fields: [creditTransactions.resumeId], references: [resumes.id] }),
}))

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, { fields: [subscriptions.userId], references: [users.id] }),
}))

export const referralsRelations = relations(referrals, ({ one }) => ({
  referrer: one(users, { fields: [referrals.referrerId], references: [users.id] }),
  referred: one(users, { fields: [referrals.referredId], references: [users.id] }),
}))

// ==================== TYPE EXPORTS ====================

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Resume = typeof resumes.$inferSelect
export type NewResume = typeof resumes.$inferInsert
export type Template = typeof templates.$inferSelect
export type NewTemplate = typeof templates.$inferInsert
export type CreditTransaction = typeof creditTransactions.$inferSelect
export type NewCreditTransaction = typeof creditTransactions.$inferInsert
export type Subscription = typeof subscriptions.$inferSelect
export type NewSubscription = typeof subscriptions.$inferInsert
export type Account = typeof accounts.$inferSelect
export type Session = typeof sessions.$inferSelect
export type SubscriptionTier = (typeof subscriptionTierEnum.enumValues)[number]
export type CreditTransactionType = (typeof creditTransactionTypeEnum.enumValues)[number]
export type CoverLetter = typeof coverLetters.$inferSelect
export type NewCoverLetter = typeof coverLetters.$inferInsert
export type TemplateCategory = (typeof templateCategoryEnum.enumValues)[number]
export type Referral = typeof referrals.$inferSelect
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect
export type ResumeVersion = typeof resumeVersions.$inferSelect
