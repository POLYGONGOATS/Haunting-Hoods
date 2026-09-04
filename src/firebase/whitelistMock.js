/**
 * Local dev-mode mock for the whitelist backend, used only when no real
 * Firebase project is configured (see `isFirebaseConfigured` in
 * `./config.js`). This lets the whole Twitter-connect -> wallet -> claim
 * flow be tested end-to-end in the browser before real Firebase/Twitter
 * credentials exist. Data is stored in localStorage and is NOT shared
 * across browsers/users — it exists purely for local UX testing.
 */
const STORAGE_KEYS = {
	user: 'mock_whitelist_user_v3',
	campaign: 'mock_whitelist_campaign_v3',
	claims: 'mock_whitelist_claims_v3',
};

const listeners = new Set();

const readJSON = (key, fallback) => {
	try {
		const raw = localStorage.getItem(key);
		return raw ? JSON.parse(raw) : fallback;
	} catch {
		return fallback;
	}
};

const writeJSON = (key, value) => {
	localStorage.setItem(key, JSON.stringify(value));
};

const getTodayCampaignId = () => {
	return 'active-campaign';
};

/** Ensures a default "today" campaign exists so the flow is testable out of the box. */
const ensureDefaultCampaign = () => {
	const existing = readJSON(STORAGE_KEYS.campaign, null);
	const todayId = getTodayCampaignId();
	if (existing && existing.id === todayId) return existing;

	const campaign = {
		id: todayId,
		code: 'HAUNTED-2026',
		slotsTotal: 50,
		claimedCount: 0,
		active: true,
	};
	writeJSON(STORAGE_KEYS.campaign, campaign);
	return campaign;
};

export const mockSignInWithTwitter = async () => {
	// Simulates a Twitter OAuth popup completing instantly with a fake user.
	const handle = `dev_hunter_${Math.floor(Math.random() * 9999)}`;
	const user = {
		uid: `mock-${handle}`,
		displayName: handle,
		reloadUserInfo: { screenName: handle },
	};
	writeJSON(STORAGE_KEYS.user, user);
	listeners.forEach((cb) => cb(user));
	return user;
};

export const mockSignOut = async () => {
	localStorage.removeItem(STORAGE_KEYS.user);
	listeners.forEach((cb) => cb(null));
};

export const mockSubscribeToAuthState = (callback) => {
	listeners.add(callback);
	const user = readJSON(STORAGE_KEYS.user, null);
	callback(user);
	return () => listeners.delete(callback);
};

export const mockGetTodayCampaign = async () => ensureDefaultCampaign();

export const mockHasUserClaimedBefore = async (uid) => {
	const claims = readJSON(STORAGE_KEYS.claims, {});
	return Boolean(claims[uid]);
};

export const mockClaimWhitelistSpot = async ({
	uid,
	twitterHandle,
	walletAddress,
	quoteTweetLink,
	code,
}) => {
	if (!walletAddress || !walletAddress.trim()) {
		const err = new Error('Wallet address is required');
		err.code = 'MISSING_WALLET';
		throw err;
	}

	const claims = readJSON(STORAGE_KEYS.claims, {});
	if (claims[uid]) {
		const err = new Error('Already claimed');
		err.code = 'ALREADY_CLAIMED';
		throw err;
	}

	const campaign = ensureDefaultCampaign();
	if (!campaign.active) {
		const err = new Error('Campaign inactive');
		err.code = 'CAMPAIGN_INACTIVE';
		throw err;
	}

	// Bedsheets pickup calls this without a code (finishing the objective IS
	// the proof), so only validate the code when one is required/provided.
	if (
		code &&
		code.trim().toUpperCase() !== String(campaign.code).trim().toUpperCase()
	) {
		const err = new Error('Incorrect code');
		err.code = 'WRONG_CODE';
		throw err;
	}

	if (campaign.claimedCount >= campaign.slotsTotal) {
		const err = new Error('Sold out');
		err.code = 'SOLD_OUT';
		throw err;
	}

	const claimNumber = campaign.claimedCount + 1;
	campaign.claimedCount = claimNumber;
	writeJSON(STORAGE_KEYS.campaign, campaign);

	claims[uid] = {
		uid,
		twitterHandle: twitterHandle || null,
		walletAddress: walletAddress.trim(),
		quoteTweetLink: quoteTweetLink ? quoteTweetLink.trim() : null,
		campaignId: campaign.id,
		claimNumber,
		createdAt: Date.now(),
	};
	writeJSON(STORAGE_KEYS.claims, claims);

	return { claimNumber, slotsTotal: campaign.slotsTotal, campaignId: campaign.id };
};
