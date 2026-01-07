import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { type NextRequest } from "next/server"
import { logger } from "@/lib/logger"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const type = requestUrl.searchParams.get("type") // Supabase adds type=recovery for password reset
  const origin = requestUrl.origin

  if (code) {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        logger.warn("Failed to exchange code for session", { 
          error: error.message, 
          type,
          errorCode: error.status 
        })
        // If there's an error, redirect to login with error message
        return NextResponse.redirect(`${origin}/login?error=invalid_token`)
      }

      // Verify we have valid data
      if (!data || (!data.session && !data.user)) {
        logger.warn("Callback succeeded but no session or user data", { type })
        return NextResponse.redirect(`${origin}/login?error=invalid_token`)
      }

      // If this is a password reset (type=recovery), redirect to reset password page
      // The session is now set via cookies, so the user will be authenticated on reset-password page
      if (type === "recovery" && data.session) {
        logger.info("Password reset callback processed", { userId: data.user?.id })
        const response = NextResponse.redirect(`${origin}/reset-password`)
        return response
      }

      // For email confirmation (signup), redirect to login with success message
      // User needs to log in after confirming email (best practice for trading platforms)
      if (data.session && data.user) {
        logger.info("Email confirmation successful", { userId: data.user.id, email: data.user.email })
        return NextResponse.redirect(`${origin}/login?confirmed=true`)
      }

      // Fallback: if we have a session but no specific type, redirect to login
      if (data.session) {
        logger.info("Callback processed with session", { userId: data.user?.id, type })
        return NextResponse.redirect(`${origin}/login?confirmed=true`)
      }
    } catch (error) {
      logger.error("Callback error", error instanceof Error ? error : new Error(String(error)), {
        code: code.substring(0, 10) + "...", // Log partial code for debugging
        type
      })
      return NextResponse.redirect(`${origin}/login?error=callback_error`)
    }
  }

  // If no code, redirect to home
  return NextResponse.redirect(`${origin}/`)
}


