-- 303030 Database Schema
-- PostgreSQL schema for the mood board booking platform
-- This schema works with Supabase and includes Row Level Security

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Custom types
CREATE TYPE user_role AS ENUM ('client', 'admin');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');
CREATE TYPE payment_type AS ENUM ('deposit', 'full', 'refund');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed');
CREATE TYPE notification_type AS ENUM ('booking', 'payment', 'system');

-- User profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    phone_number TEXT,
    email TEXT,
    name TEXT,
    brand_name TEXT,
    role user_role DEFAULT 'client',
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Models table
CREATE TABLE models (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    bio TEXT,
    one_liner TEXT,
    height TEXT,
    bust TEXT,
    waist TEXT,
    hips TEXT,
    shoe_size TEXT,
    hair_color TEXT,
    eye_color TEXT,
    experience_level TEXT,
    hourly_rate INTEGER,
    is_active BOOLEAN DEFAULT true,
    profile_image TEXT,
    portfolio_images TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Moodboards table
CREATE TABLE moodboards (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    liner TEXT,
    date DATE,
    model_count INTEGER DEFAULT 1,
    is_booked BOOLEAN DEFAULT false,
    main_image TEXT,
    look_feel_images TEXT[],
    mood_shots TEXT[],
    hair_makeup_images TEXT[],
    tags TEXT[],
    style TEXT,
    color_palette TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Junction table for moodboard-model relationships
CREATE TABLE moodboard_models (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    moodboard_id UUID REFERENCES moodboards(id) ON DELETE CASCADE,
    model_id UUID REFERENCES models(id) ON DELETE CASCADE,
    is_default BOOLEAN DEFAULT false,
    price INTEGER, -- Override model's hourly_rate for this moodboard
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(moodboard_id, model_id)
);

-- Similar moodboards for recommendations
CREATE TABLE similar_moodboards (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    moodboard_id UUID REFERENCES moodboards(id) ON DELETE CASCADE,
    similar_moodboard_id UUID REFERENCES moodboards(id) ON DELETE CASCADE,
    similarity_score DECIMAL(3,2) DEFAULT 0.0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(moodboard_id, similar_moodboard_id)
);

-- Bookings table
CREATE TABLE bookings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    model_id UUID REFERENCES models(id),
    moodboard_id UUID REFERENCES moodboards(id),
    booking_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    duration_hours INTEGER,
    location TEXT,
    product_count INTEGER DEFAULT 1,
    extra_requirements TEXT,
    instructions TEXT,
    status booking_status DEFAULT 'pending',
    total_amount INTEGER NOT NULL,
    amount_paid INTEGER DEFAULT 0,
    deposit_amount INTEGER,
    deposit_paid BOOLEAN DEFAULT false,
    full_payment_paid BOOLEAN DEFAULT false,
    brand_logo TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    payment_type payment_type NOT NULL,
    payment_method TEXT,
    transaction_id TEXT,
    razorpay_payment_id TEXT,
    razorpay_order_id TEXT,
    razorpay_signature TEXT,
    status payment_status DEFAULT 'pending',
    payment_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type notification_type NOT NULL,
    is_read BOOLEAN DEFAULT false,
    related_entity_type TEXT,
    related_entity_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Settings table for application configuration
CREATE TABLE settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value JSONB,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_created_at ON profiles(created_at);
CREATE INDEX idx_models_is_active ON models(is_active);
CREATE INDEX idx_models_created_at ON models(created_at);
CREATE INDEX idx_moodboards_is_active ON moodboards(is_active);
CREATE INDEX idx_moodboards_date ON moodboards(date);
CREATE INDEX idx_moodboards_is_booked ON moodboards(is_booked);
CREATE INDEX idx_moodboards_tags ON moodboards USING GIN(tags);
CREATE INDEX idx_bookings_client_id ON bookings(client_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_booking_date ON bookings(booking_date);
CREATE INDEX idx_payments_booking_id ON payments(booking_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- Row Level Security (RLS) Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE models ENABLE ROW LEVEL SECURITY;
ALTER TABLE moodboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE moodboard_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE similar_moodboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- RLS Policies for models
CREATE POLICY "Anyone can view active models" ON models
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage models" ON models
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- RLS Policies for moodboards
CREATE POLICY "Anyone can view active moodboards" ON moodboards
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage moodboards" ON moodboards
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- RLS Policies for moodboard_models
CREATE POLICY "Anyone can view moodboard models" ON moodboard_models
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage moodboard models" ON moodboard_models
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- RLS Policies for similar_moodboards
CREATE POLICY "Anyone can view similar moodboards" ON similar_moodboards
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage similar moodboards" ON similar_moodboards
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- RLS Policies for bookings
CREATE POLICY "Users can view their own bookings" ON bookings
    FOR SELECT USING (auth.uid() = client_id);

CREATE POLICY "Users can create bookings" ON bookings
    FOR INSERT WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Users can update their own bookings" ON bookings
    FOR UPDATE USING (auth.uid() = client_id);

CREATE POLICY "Admins can view all bookings" ON bookings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- RLS Policies for payments
CREATE POLICY "Users can view their own payments" ON payments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM bookings 
            WHERE bookings.id = payments.booking_id 
            AND bookings.client_id = auth.uid()
        )
    );

CREATE POLICY "System can create payments" ON payments
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all payments" ON payments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" ON notifications
    FOR INSERT WITH CHECK (true);

-- RLS Policies for settings
CREATE POLICY "Admins can manage settings" ON settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Functions
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, phone_number, email, role)
    VALUES (NEW.id, NEW.phone, NEW.email, 'client');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER models_updated_at BEFORE UPDATE ON models FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER moodboards_updated_at BEFORE UPDATE ON moodboards FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER settings_updated_at BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Function to create booking and calculate price
CREATE OR REPLACE FUNCTION create_booking_and_calculate_price(
    p_moodboard_id UUID,
    p_selected_model_id UUID,
    p_product_count INTEGER DEFAULT 1,
    p_extra_requirements TEXT DEFAULT NULL,
    p_instructions TEXT DEFAULT NULL,
    p_brand_logo TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_booking_id UUID;
    v_model_price INTEGER;
    v_total_amount INTEGER;
    v_deposit_amount INTEGER;
    v_moodboard_date DATE;
BEGIN
    -- Get model price from moodboard_models or fallback to model's hourly_rate
    SELECT COALESCE(mm.price, m.hourly_rate, 50000) INTO v_model_price
    FROM models m
    LEFT JOIN moodboard_models mm ON mm.model_id = m.id AND mm.moodboard_id = p_moodboard_id
    WHERE m.id = p_selected_model_id;
    
    -- Get moodboard date
    SELECT date INTO v_moodboard_date FROM moodboards WHERE id = p_moodboard_id;
    
    -- Calculate total amount (model price * product count)
    v_total_amount := v_model_price * p_product_count;
    
    -- Calculate 10% deposit
    v_deposit_amount := ROUND(v_total_amount * 0.1);
    
    -- Create booking
    INSERT INTO bookings (
        client_id,
        model_id,
        moodboard_id,
        booking_date,
        product_count,
        extra_requirements,
        instructions,
        brand_logo,
        total_amount,
        deposit_amount,
        status
    ) VALUES (
        auth.uid(),
        p_selected_model_id,
        p_moodboard_id,
        v_moodboard_date,
        p_product_count,
        p_extra_requirements,
        p_instructions,
        p_brand_logo,
        v_total_amount,
        v_deposit_amount,
        'pending'
    ) RETURNING id INTO v_booking_id;
    
    -- Mark moodboard as booked
    UPDATE moodboards SET is_booked = true WHERE id = p_moodboard_id;
    
    RETURN v_booking_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 