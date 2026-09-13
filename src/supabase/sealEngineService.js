import { supabase, isSupabaseConfigured } from './config';
import {
	mockGetSealEngineState,
	mockFeedSealEngine
} from './sealEngineMock';

export const getSealEngineState = async () => {
	if (!isSupabaseConfigured) return mockGetSealEngineState();

	const { data, error } = await supabase
		.from('seal_engine_stats')
		.select('*')
		.eq('id', 1)
		.single();

	if (error) {
		if (error.code === 'PGRST116') {
			// Row doesn't exist yet, return default
			return { total_marks_fed: 0, target_marks: 4444, is_broken: false };
		}
		throw error;
	}

	return data;
};

export const feedSealEngine = async (walletAddress, twitterHandle, amount) => {
	if (!isSupabaseConfigured) return mockFeedSealEngine(walletAddress, twitterHandle, amount);

	const { data, error } = await supabase.rpc('feed_seal_engine', {
		p_wallet_address: walletAddress,
		p_twitter_handle: twitterHandle,
		p_marks_amount: amount
	});

	if (error) throw error;
	
	if (!data.success) {
		throw new Error(data.error || 'Failed to feed the engine.');
	}

	return data;
};
