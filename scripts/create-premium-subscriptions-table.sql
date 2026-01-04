-- Create premium_subscriptions table for PayPal subscriptions
CREATE TABLE IF NOT EXISTS public.premium_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  email CHARACTER VARYING(255) NOT NULL,
  paypal_order_id CHARACTER VARYING(255) NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  currency CHARACTER VARYING(3) NOT NULL DEFAULT 'USD'::character varying,
  status CHARACTER VARYING(50) NOT NULL DEFAULT 'active'::character varying,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  payment_method CHARACTER VARYING(50) NOT NULL DEFAULT 'paypal'::character varying,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
  CONSTRAINT premium_subscriptions_pkey PRIMARY KEY (id),
  CONSTRAINT premium_subscriptions_paypal_order_id_key UNIQUE (paypal_order_id)
) TABLESPACE pg_default;

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_premium_subscriptions_email ON public.premium_subscriptions USING btree (email) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_premium_subscriptions_status ON public.premium_subscriptions USING btree (status) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_premium_subscriptions_expires_at ON public.premium_subscriptions USING btree (expires_at) TABLESPACE pg_default;

-- Enable Row Level Security
ALTER TABLE public.premium_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own subscriptions
CREATE POLICY "Users can read their own subscriptions" ON public.premium_subscriptions
  FOR SELECT
  USING (true);

-- Create policy to allow API to insert subscriptions
CREATE POLICY "API can insert subscriptions" ON public.premium_subscriptions
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow API to update subscriptions
CREATE POLICY "API can update subscriptions" ON public.premium_subscriptions
  FOR UPDATE
  USING (true);
