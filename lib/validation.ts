import { z } from "zod"

// Auth validation schemas
export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  recaptchaToken: z.string().optional(), // Temporarily disabled
})

export const signupSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().optional(),
  recaptchaToken: z.string().optional(), // Temporarily disabled
})

// Subscription validation
export const subscriptionSchema = z.object({
  subscriptionType: z.enum(["free", "trial", "one_day", "premium"]),
  days: z.number().int().min(1).max(365),
})

// Profile validation
export const profileUpdateSchema = z.object({
  fullName: z.string().min(1, "Full name is required").max(255, "Full name is too long").optional(),
})

// API query validation
export const symbolSchema = z.string().min(1).max(10).regex(/^[A-Z]+$/, "Invalid symbol format")
export const timeframeSchema = z.enum(["1H", "4H", "1D", "1W"])

// Economic calendar validation
export const dateRangeSchema = z.object({
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
})

export const countrySchema = z.string().length(2, "Country code must be 2 characters")
export const exchangeSchema = z.string().min(1).max(10)

// Helper function to validate and parse
export function validateAndParse<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } {
  try {
    const parsed = schema.parse(data)
    return { success: true, data: parsed }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map(e => `${e.path.join(".")}: ${e.message}`).join(", "),
      }
    }
    return { success: false, error: "Validation failed" }
  }
}

