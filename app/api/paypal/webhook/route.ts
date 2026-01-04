import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { logger } from "@/lib/logger"

// PayPal requires raw body for signature verification
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// ==============================
// ENV
// ==============================
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
// PayPal environment - in production, default to "live", in development default to "sandbox"
const PAYPAL_ENV = process.env.PAYPAL_ENV || (process.env.NODE_ENV === "production" ? "live" : "sandbox")
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET
const PAYPAL_WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID

if (
  !SUPABASE_URL ||
  !SUPABASE_SERVICE_ROLE_KEY ||
  !PAYPAL_CLIENT_ID ||
  !PAYPAL_CLIENT_SECRET ||
  !PAYPAL_WEBHOOK_ID
) {
  logger.error("Missing required PayPal ENV variables")
  throw new Error("Missing required ENV variables for PayPal webhook")
}

// In production, PayPal should always be "live"
if (process.env.NODE_ENV === "production" && PAYPAL_ENV !== "live") {
  logger.error("PayPal environment must be 'live' in production", { currentEnv: PAYPAL_ENV })
  throw new Error("PayPal environment must be 'live' in production")
}

// ==============================
// Supabase (Service Role)
// ==============================
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
})

// ==============================
// PayPal helpers
// ==============================
const PAYPAL_API_BASE =
  PAYPAL_ENV === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com"

async function getPayPalAccessToken(): Promise<string> {
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

async function verifyPayPalWebhook(headers: Headers, rawBody: string): Promise<boolean> {
  try {
    const accessToken = await getPayPalAccessToken()

    const payload = {
      auth_algo: headers.get("paypal-auth-algo") || "",
      cert_url: headers.get("paypal-cert-url") || "",
      transmission_id: headers.get("paypal-transmission-id") || "",
      transmission_sig: headers.get("paypal-transmission-sig") || "",
      transmission_time: headers.get("paypal-transmission-time") || "",
      webhook_id: PAYPAL_WEBHOOK_ID,
      webhook_event: JSON.parse(rawBody),
    }

    const res = await fetch(`${PAYPAL_API_BASE}/v1/notifications/verify-webhook-signature`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const errorText = await res.text()
      logger.error("PayPal signature verification failed", new Error(errorText))
      return false
    }

    const data = await res.json()
    return data.verification_status === "SUCCESS"
  } catch (error) {
    logger.error("PayPal webhook verification error", error instanceof Error ? error : new Error(String(error)))
    return false
  }
}

// Helper to get raw body in Next.js
async function getRawBody(request: NextRequest): Promise<string> {
  try {
    // Next.js App Router - get text directly
    const text = await request.text()
    return text
  } catch (error) {
    logger.error("Failed to read raw body", error instanceof Error ? error : new Error(String(error)))
    throw new Error("Failed to read request body")
  }
}

// ==============================
// WEBHOOK ENDPOINT
// ==============================
export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature verification
    const rawBody = await getRawBody(request)
    
    // 1️⃣ Verify signature
    const isValid = await verifyPayPalWebhook(request.headers, rawBody)
    if (!isValid) {
      logger.warn("Invalid PayPal webhook signature")
      return NextResponse.json({ error: "Invalid PayPal signature" }, { status: 400 })
    }

    const event = JSON.parse(rawBody)
    const eventType = event.event_type

    logger.info("PayPal webhook received", { eventType })

    // Interesują nas tylko płatności zakończone
    if (eventType !== "CHECKOUT.ORDER.APPROVED" && eventType !== "PAYMENT.CAPTURE.COMPLETED") {
      logger.debug("PayPal webhook event ignored", { eventType })
      return NextResponse.json({ ignored: true })
    }

    const order = event.resource
    const paypalOrderId = order.id
    const payerEmail = order.payer?.email_address

    // Get amount from purchase_units
    const purchaseUnit = order.purchase_units?.[0]
    const amount = purchaseUnit?.amount?.value
    const currency = purchaseUnit?.amount?.currency_code || "USD"

    if (!payerEmail || !paypalOrderId) {
      logger.error("Missing PayPal order data", new Error("Missing email or order ID"))
      return NextResponse.json({ error: "Missing PayPal order data" }, { status: 400 })
    }

    // Determine subscription duration based on amount
    // $1 = 1 day, $7 = 7 days
    const amountNum = typeof amount === "string" ? parseFloat(amount) : amount
    let days = 1
    if (amountNum === 7) {
      days = 7
    } else if (amountNum === 1) {
      days = 1
    } else {
      // Default to 1 day if amount doesn't match
      logger.warn("Unexpected PayPal amount", { amount, email: payerEmail })
      days = 1
    }

    // 2️⃣ Znajdź user_id po emailu
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("user_id")
      .eq("email", payerEmail)
      .single()

    if (profileError || !profile) {
      logger.error("User not found for PayPal email", new Error(profileError?.message || "Profile not found"), { email: payerEmail })
      return NextResponse.json({ error: "User not found for PayPal email" }, { status: 404 })
    }

    const userId = profile.user_id

    // 3️⃣ Oblicz expiry
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + days)

    // 4️⃣ Zapis do premium_subscriptions (log płatności)
    const { error: premiumError } = await supabase.from("premium_subscriptions").insert({
      email: payerEmail,
      paypal_order_id: paypalOrderId,
      amount: parseFloat(amount),
      currency: currency,
      status: "active",
      expires_at: expiresAt.toISOString(),
      payment_method: "paypal",
    })

    if (premiumError) {
      logger.error("Failed to insert premium subscription", new Error(premiumError.message), { email: payerEmail, orderId: paypalOrderId })
      // Continue anyway - we still want to update user_subscriptions
    }

    // 5️⃣ UPSERT do user_subscriptions (ŹRÓDŁO PRAWDY)
    const { error: subscriptionError } = await supabase
      .from("user_subscriptions")
      .upsert(
        {
          user_id: userId,
          subscription_type: "premium",
          status: "active",
          expires_at: expiresAt.toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      )

    if (subscriptionError) {
      logger.error("Failed to update user subscription", new Error(subscriptionError.message), { userId, email: payerEmail })
      return NextResponse.json({ error: "Failed to update subscription" }, { status: 500 })
    }

    logger.info("PayPal subscription activated", { userId, email: payerEmail, days, orderId: paypalOrderId })

    return NextResponse.json({ success: true })
  } catch (err) {
    logger.error("PayPal webhook error", err instanceof Error ? err : new Error(String(err)))
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

