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
) RETURNS json AS $$
DECLARE
    v_current_total bigint;
    v_target bigint;
    v_is_broken boolean;
BEGIN
    -- 1. Lock the global row to prevent race conditions
    SELECT total_marks_fed, target_marks, is_broken 
    INTO v_current_total, v_target, v_is_broken
    FROM seal_engine_stats 
    WHERE id = 1 
    FOR UPDATE;

    -- 2. Check if already broken
    IF v_is_broken THEN
        RETURN json_build_object('success', false, 'error', 'The seal is already broken.');
    END IF;

    -- 3. Update global stats
    UPDATE seal_engine_stats
    SET total_marks_fed = total_marks_fed + p_marks_amount,
        is_broken = CASE WHEN (total_marks_fed + p_marks_amount) >= target_marks THEN true ELSE false END,
        updated_at = timezone('utc'::text, now())
    WHERE id = 1;

    -- 4. Upsert user contribution (for the raffle)
    INSERT INTO seal_engine_contributions (wallet_address, twitter_handle, marks_contributed)
    VALUES (p_wallet_address, p_twitter_handle, p_marks_amount)
    ON CONFLICT (wallet_address) 
    DO UPDATE SET 
        marks_contributed = seal_engine_contributions.marks_contributed + EXCLUDED.marks_contributed,
        twitter_handle = COALESCE(EXCLUDED.twitter_handle, seal_engine_contributions.twitter_handle),
        updated_at = timezone('utc'::text, now());

    -- 5. Return the new state
    RETURN json_build_object(
        'success', true, 
        'total_marks_fed', v_current_total + p_marks_amount,
        'is_broken', CASE WHEN (v_current_total + p_marks_amount) >= v_target THEN true ELSE false END
    );
END;
$$ LANGUAGE plpgsql;
