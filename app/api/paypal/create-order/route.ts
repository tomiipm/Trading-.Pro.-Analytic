import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { logger } from "@/lib/logger"
import { getServerSiteUrl } from "@/lib/config"

// PayPal environment - in production, default to "live", in development default to "sandbox"
// But prefer explicit PAYPAL_ENV if set
const PAYPAL_ENV = process.env.PAYPAL_ENV || (process.env.NODE_ENV === "production" ? "live" : "sandbox")
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET

// In production, PayPal should always be "live"
if (process.env.NODE_ENV === "production" && PAYPAL_ENV !== "live") {
  logger.warn("PayPal environment should be 'live' in production", { currentEnv: PAYPAL_ENV })
}

// Validate PayPal credentials
if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
  logger.error("PayPal credentials are missing", undefined, { env: PAYPAL_ENV })
}

const PAYPAL_API_BASE =
  PAYPAL_ENV === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com"

async function getPayPalAccessToken(): Promise<string> {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error("PayPal credentials not configured")
  }

  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64")

  const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  })

  if (!res.ok) {
    const errorText = await res.text()
    logger.error("Failed to get PayPal access token", new Error(errorText))
    throw new Error("Failed to get PayPal access token")
  }

  const data = await res.json()
  return data.access_token
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { amount, currency = "USD", days } = body

    if (!amount || !days) {
      return NextResponse.json(
        { error: "Amount and days are required" },
        { status: 400 }
      )
    }

    // Validate amount matches days
    if ((amount === 1 && days !== 1) || (amount === 7 && days !== 7)) {
      return NextResponse.json(
        { error: "Amount does not match subscription duration" },
        { status: 400 }
      )
    }

    const accessToken = await getPayPalAccessToken()

    // Get site URL using helper function
    const siteUrl = getServerSiteUrl(request)
    
    // Create PayPal order
    const orderData = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: amount.toString(),
          },
          description: `Premium subscription - ${days} ${days === 1 ? "day" : "days"}`,
        },
      ],
      application_context: {
        brand_name: "Trading Pro Analytic",
        landing_page: "NO_PREFERENCE",
        user_action: "PAY_NOW",
        return_url: `${siteUrl}/subscriptions?success=true`,
        cancel_url: `${siteUrl}/subscriptions?canceled=true`,
      },
    }

    const res = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    })

    if (!res.ok) {
      const errorText = await res.text()
      logger.error("Failed to create PayPal order", new Error(errorText))
      return NextResponse.json(
        { error: "Failed to create PayPal order" },
        { status: 500 }
      )
    }

    const order = await res.json()

    logger.info("PayPal order created", { userId: user.id, orderId: order.id, amount, days })

    return NextResponse.json({
      success: true,
      orderId: order.id,
      approvalUrl: order.links?.find((link: any) => link.rel === "approve")?.href,
    })
  } catch (error) {
    logger.error("PayPal create order error", error instanceof Error ? error : new Error(String(error)))
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    )
  }
}

