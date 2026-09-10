import { supabase, isSupabaseConfigured } from './config';
import {
	mockSignInWithTwitter,
	mockSignOut,
	mockSubscribeToAuthState,
	mockGetTodayCampaign,
	mockHasUserClaimedBefore,
	mockClaimWhitelistSpot,
} from './whitelistMock';

const CAMPAIGNS_COLLECTION = 'whitelist_campaigns';
const CLAIMS_COLLECTION = 'whitelist_claims';
const VERIFICATIONS_COLLECTION = 'mark_verifications';

export const getTodayCampaignId = () => {
	return 'active-campaign';
};

export const signInWithTwitter = async () => {
	if (!isSupabaseConfigured) return mockSignInWithTwitter();
	
	const { data, error } = await supabase.auth.signInWithOAuth({
		provider: 'twitter',
	});
	
	if (error) throw error;
	return data;
};

export const signOutUser = async () => {
	if (!isSupabaseConfigured) return mockSignOut();
	if (supabase) {
		await supabase.auth.signOut();
	}
};

export const subscribeToAuthState = (callback) => {
	if (!isSupabaseConfigured) return mockSubscribeToAuthState(callback);
	if (!supabase) {
		callback(null);
		return () => {};
	}
	
	// Get initial session
	supabase.auth.getSession().then(({ data: { session } }) => {
		callback(session?.user || null);
	});

	// Listen for changes
	const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
		callback(session?.user || null);
	});
	
	return () => subscription.unsubscribe();
};

export const getTodayCampaign = async () => {
	if (!isSupabaseConfigured) return mockGetTodayCampaign();
	
	const campaignId = getTodayCampaignId();
	const { data, error } = await supabase
		.from(CAMPAIGNS_COLLECTION)
		.select('*')
		.eq('id', campaignId)
		.single();
		
	if (error && error.code === 'PGRST116') {
		// Doesn't exist, though our SQL script creates it.
		// Fallback just in case.
		const defaultCampaign = {
			id: campaignId,
			code: 'HAUNTED',
			slotstotal: 4444, // PG columns are case-insensitive unless quoted, but supabase JS maps exact
			claimedcount: 0,
			active: true,
		};
		return defaultCampaign;
	}
	
	if (error) throw error;
	
	// Map to JS camelCase properties expected by frontend
	return {
		id: data.id,
		code: data.code,
		slotsTotal: data.slotstotal,
		claimedCount: data.claimedcount,
		active: data.active
	};
};

export const hasUserClaimedBefore = async (uid) => {
	if (!isSupabaseConfigured) return mockHasUserClaimedBefore(uid);
	const { data, error } = await supabase
		.from(CLAIMS_COLLECTION)
		.select('uid')
		.eq('uid', uid)
		.single();
		
	if (error && error.code === 'PGRST116') return false; // Doesn't exist
	if (error) throw error;
	return !!data;
};

export const CLAIM_ERRORS = {
	ALREADY_CLAIMED: 'ALREADY_CLAIMED',
	CAMPAIGN_INACTIVE: 'CAMPAIGN_INACTIVE',
	SOLD_OUT: 'SOLD_OUT',
	WRONG_CODE: 'WRONG_CODE',
	MISSING_WALLET: 'MISSING_WALLET',
	MISSING_FIELDS: 'MISSING_FIELDS',
	ALREADY_SUBMITTED: 'ALREADY_SUBMITTED'
};

export const claimWhitelistSpot = async ({
	uid,
	twitterHandle,
	discordUser,
	walletAddress,
	quoteTweetLink,
	code,
}) => {
	if (!walletAddress || !walletAddress.trim()) {
		const err = new Error('Wallet address is required');
		err.code = CLAIM_ERRORS.MISSING_WALLET;
		throw err;
	}

	if (!isSupabaseConfigured) {
		return mockClaimWhitelistSpot({ uid, twitterHandle, discordUser, walletAddress, quoteTweetLink, code });
	}

	const campaignId = getTodayCampaignId();
	
	// Verify code locally first if needed
	if (code) {
		const campaign = await getTodayCampaign();
		if (code.trim().toUpperCase() !== String(campaign.code).trim().toUpperCase()) {
			const err = new Error('Incorrect code');
			err.code = CLAIM_ERRORS.WRONG_CODE;
			throw err;
		}
	}
	
	// Check if already claimed
	const claimed = await hasUserClaimedBefore(uid);
	if (claimed) {
		const err = new Error('You have already claimed a whitelist spot');
		err.code = CLAIM_ERRORS.ALREADY_CLAIMED;
		throw err;
	}

	// Use our Supabase RPC function for the atomic transaction
	const { data, error } = await supabase.rpc('claim_whitelist_spot', {
		p_uid: uid,
		p_twitter_handle: twitterHandle || null,
		p_discord_user: discordUser ? discordUser.trim() : null,
		p_wallet_address: walletAddress.trim(),
		p_quote_tweet_link: quoteTweetLink ? quoteTweetLink.trim() : null,
		p_campaign_id: campaignId
	});

	if (error) {
		const err = new Error(error.message);
		if (error.message.includes('CAMPAIGN_INACTIVE')) err.code = CLAIM_ERRORS.CAMPAIGN_INACTIVE;
		if (error.message.includes('SOLD_OUT')) err.code = CLAIM_ERRORS.SOLD_OUT;
		if (error.message.includes('duplicate key value violates unique constraint "whitelist_claims_pkey"')) {
			err.code = CLAIM_ERRORS.ALREADY_CLAIMED;
			err.message = 'You have already claimed a whitelist spot';
		}
		throw err;
	}

	return {
		claimNumber: data.claimNumber,
		slotsTotal: data.slotsTotal,
		campaignId: data.campaignId
	};
};

export const submitMarkVerification = async ({
	discordUser,
	twitterHandle,
	tweetUrl,
	walletAddress,
	markCode,
}) => {
	if (!discordUser || !twitterHandle || !tweetUrl || !walletAddress || !markCode) {
		const err = new Error('All fields are required');
		err.code = CLAIM_ERRORS.MISSING_FIELDS;
		throw err;
	}

	if (!isSupabaseConfigured) {
		return { success: true };
	}

	// Check if exists
	const { data: existing, error: getError } = await supabase
		.from(VERIFICATIONS_COLLECTION)
		.select('markcode')
		.eq('markcode', markCode)
		.single();

	if (existing) {
		const err = new Error('This Mark has already been verified.');
		err.code = CLAIM_ERRORS.ALREADY_SUBMITTED;
		throw err;
	}

	const { error } = await supabase
		.from(VERIFICATIONS_COLLECTION)
		.insert({
			markcode: markCode,
			discorduser: discordUser.trim(),
			twitterhandle: twitterHandle.trim(),
			tweeturl: tweetUrl.trim(),
			walletaddress: walletAddress.trim(),
			status: 'PENDING'
		});

	if (error) {
		if (error.code === '23505') { // Unique violation
			const err = new Error('This Mark has already been verified.');
			err.code = CLAIM_ERRORS.ALREADY_SUBMITTED;
			throw err;
		}
		throw error;
	}

	return { success: true, markCode };
};

export const getAllVerifications = async () => {
	if (!isSupabaseConfigured) return [];
	const { data, error } = await supabase
		.from(VERIFICATIONS_COLLECTION)
		.select('*')
		.order('createdat', { ascending: false });
		
	if (error) throw error;
	
	// Map PostgreSQL lowercase columns back to JS camelCase
	return data.map(mark => ({
		markCode: mark.markcode,
		discordUser: mark.discorduser,
		twitterHandle: mark.twitterhandle,
		tweetUrl: mark.tweeturl,
		walletAddress: mark.walletaddress,
		status: mark.status,
		createdAt: mark.createdat
	}));
};

export const updateVerificationStatus = async (markCode, status) => {
	if (!isSupabaseConfigured) return;
	const { error } = await supabase
		.from(VERIFICATIONS_COLLECTION)
		.update({ status })
		.eq('markcode', markCode);
		
	if (error) throw error;
};
