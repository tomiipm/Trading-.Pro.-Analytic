import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { logger } from "@/lib/logger"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return NextResponse.json(
        { authorized: false },
        { status: 401 }
      )
    }

    return NextResponse.json({
      authorized: true,
    })
  } catch (error) {
    logger.error("Check reset token error", error instanceof Error ? error : new Error(String(error)))
    return NextResponse.json(
      { authorized: false },
      { status: 500 }
    )
  }
}

