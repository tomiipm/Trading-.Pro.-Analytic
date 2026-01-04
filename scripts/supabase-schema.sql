-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user_subscriptions table for managing subscriptions
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_type VARCHAR(50) NOT NULL CHECK (subscription_type IN ('free', 'trial', 'one_day', 'premium')),
  status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
  starts_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_expires_at ON user_subscriptions(expires_at);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_type ON user_subscriptions(subscription_type);

-- Create user_profiles table for additional user information
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for user_profiles
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);

-- Enable Row Level Security
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_subscriptions
CREATE POLICY "Users can view their own subscriptions" ON user_subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions" ON user_subscriptions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions" ON user_subscriptions
  FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for user_profiles
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  
  -- Create free subscription by default
  INSERT INTO public.user_subscriptions (user_id, subscription_type, status, expires_at)
  VALUES (NEW.id, 'free', 'active', NOW() + INTERVAL '100 years');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to check if subscription is active
CREATE OR REPLACE FUNCTION public.is_subscription_active(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_subscriptions
    WHERE user_id = user_uuid
      AND status = 'active'
      AND expires_at > NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get subscription type
CREATE OR REPLACE FUNCTION public.get_subscription_type(user_uuid UUID)
RETURNS VARCHAR(50) AS $$
BEGIN
  RETURN (
    SELECT subscription_type FROM user_subscriptions
    WHERE user_id = user_uuid
      AND status = 'active'
      AND expires_at > NOW()
    ORDER BY created_at DESC
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Premium Subscriptions Table (for PayPal subscriptions)
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

-- Create indexes for premium_subscriptions
CREATE INDEX IF NOT EXISTS idx_premium_subscriptions_email ON public.premium_subscriptions USING btree (email) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_premium_subscriptions_status ON public.premium_subscriptions USING btree (status) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_premium_subscriptions_expires_at ON public.premium_subscriptions USING btree (expires_at) TABLESPACE pg_default;

-- Enable Row Level Security for premium_subscriptions
ALTER TABLE public.premium_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for premium_subscriptions
CREATE POLICY "Users can read their own premium subscriptions" ON public.premium_subscriptions
  FOR SELECT
  USING (true);

CREATE POLICY "API can insert premium subscriptions" ON public.premium_subscriptions
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "API can update premium subscriptions" ON public.premium_subscriptions
  FOR UPDATE
  USING (true);

