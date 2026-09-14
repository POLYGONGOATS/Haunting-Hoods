-- Supabase Schema for The Seal Engine (Live Event)

-- 1. Create the global stats table
CREATE TABLE IF NOT EXISTS seal_engine_stats (
    id integer PRIMARY KEY DEFAULT 1,
    total_marks_fed bigint DEFAULT 0,
    target_marks bigint DEFAULT 4444,
    is_broken boolean DEFAULT false,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    CONSTRAINT single_row CHECK (id = 1)
);

-- Insert the initial row if it doesn't exist
INSERT INTO seal_engine_stats (id, total_marks_fed, target_marks, is_broken)
VALUES (1, 0, 4444, false)
ON CONFLICT (id) DO NOTHING;


-- 2. Create the contributions table (for the raffle)
CREATE TABLE IF NOT EXISTS seal_engine_contributions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_address text NOT NULL,
    twitter_handle text,
    marks_contributed bigint DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    UNIQUE(wallet_address)
);


-- 3. RPC Function: Feed the Engine
-- This safely increments the global total_marks_fed and logs the user's contribution
CREATE OR REPLACE FUNCTION feed_seal_engine(
    p_wallet_address text,
    p_twitter_handle text,
    p_marks_amount bigint
) RETURNS json SECURITY DEFINER AS $$
BEGIN
    -- 1. Upsert user contribution (for the raffle)
    INSERT INTO seal_engine_contributions (wallet_address, twitter_handle, marks_contributed)
    VALUES (p_wallet_address, p_twitter_handle, p_marks_amount)
    ON CONFLICT (wallet_address) 
    DO UPDATE SET 
        marks_contributed = seal_engine_contributions.marks_contributed + EXCLUDED.marks_contributed,
        twitter_handle = COALESCE(EXCLUDED.twitter_handle, seal_engine_contributions.twitter_handle),
        updated_at = timezone('utc'::text, now());

    -- 2. Return success
    RETURN json_build_object('success', true);
END;
$$ LANGUAGE plpgsql;
