import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { logger } from "@/lib/logger"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.signOut()

    if (error) {
      logger.warn("Logout failed", { error: error.message })
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    logger.info("User logged out successfully")
    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    })
  } catch (error) {
    logger.error("Logout error", error instanceof Error ? error : new Error(String(error)))
    return NextResponse.json(
      { error: "An error occurred during logout" },
      { status: 500 }
    )
  }
}


