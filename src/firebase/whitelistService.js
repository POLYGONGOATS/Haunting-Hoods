import { db, auth, twitterProvider, isFirebaseConfigured } from './config';
import {
	signInWithPopup,
	signOut,
	onAuthStateChanged,
} from 'firebase/auth';
import {
	doc,
	getDoc,
	setDoc,
	runTransaction,
	serverTimestamp,
} from 'firebase/firestore';
import {
	mockGetTodayCampaign,
	mockClaimWhitelistSpot,
} from './whitelistMock';

const CAMPAIGNS_COLLECTION = 'whitelist_campaigns';
const CLAIMS_COLLECTION = 'whitelist_claims';

/**
 * Returns today's campaign id in UTC, e.g. "2026-08-29".
 * Every day automatically becomes a new campaign/clue/slot pool.
 */
export const getTodayCampaignId = () => {
	return 'active-campaign';
};


/**
 * Fetches today's campaign document. Expected shape (created manually or via
 * an admin script in Firestore):
 * {
 *   code: 'THE-CODE-PAINTED-ON-THE-WALL',
 *   slotsTotal: 50,
 *   claimedCount: 0,
 *   active: true
 * }
 */
export const getTodayCampaign = async () => {
	if (!isFirebaseConfigured) return mockGetTodayCampaign();
	const ref = doc(db, CAMPAIGNS_COLLECTION, getTodayCampaignId());
	const snap = await getDoc(ref);
	if (!snap.exists()) {
		const defaultCampaign = {
			code: 'HAUNTED',
			slotsTotal: 1000,
			claimedCount: 0,
			active: true,
		};
		await setDoc(ref, defaultCampaign);
		return { id: ref.id, ...defaultCampaign };
	}
	return { id: snap.id, ...snap.data() };
};



export const CLAIM_ERRORS = {
	ALREADY_CLAIMED: 'ALREADY_CLAIMED',
	CAMPAIGN_INACTIVE: 'CAMPAIGN_INACTIVE',
	SOLD_OUT: 'SOLD_OUT',
	WRONG_CODE: 'WRONG_CODE',
	MISSING_WALLET: 'MISSING_WALLET',
};

/**
 * Attempts to claim today's whitelist spot for the given user.
 * Uses a single atomic transaction across both the campaign counter doc and
 * the user's claim doc so that:
 *  - a user can never claim twice (claim doc id === uid, created once)
 *  - slots can never be oversold, even with concurrent claims
 *
 * `code` is optional: the wall-clue puzzle path requires it (proof the
 * player found the painted code), while the bedsheets pickup path omits it
 * (finishing that objective is itself the proof).
 */
export const claimWhitelistSpot = async ({
	twitterHandle,
	walletAddress,
	quoteTweetLink,
	code,
}) => {
	if (!twitterHandle || !twitterHandle.trim()) {
		const err = new Error('Twitter handle is required');
		err.code = 'MISSING_TWITTER';
		throw err;
	}

	const sanitizedHandle = twitterHandle.replace('@', '').trim().toLowerCase();

	if (!walletAddress || !walletAddress.trim()) {
		const err = new Error('Wallet address is required');
		err.code = CLAIM_ERRORS.MISSING_WALLET;
		throw err;
	}

	if (!isFirebaseConfigured) {
		return mockClaimWhitelistSpot({ twitterHandle: sanitizedHandle, walletAddress, quoteTweetLink, code });
	}

	const campaignId = getTodayCampaignId();
	const campaignRef = doc(db, CAMPAIGNS_COLLECTION, campaignId);
	const claimRef = doc(db, CLAIMS_COLLECTION, sanitizedHandle);

	return runTransaction(db, async (transaction) => {
		const [campaignSnap, claimSnap] = await Promise.all([
			transaction.get(campaignRef),
			transaction.get(claimRef),
		]);

		if (claimSnap.exists()) {
			const err = new Error('You have already claimed a whitelist spot');
			err.code = CLAIM_ERRORS.ALREADY_CLAIMED;
			throw err;
		}

		let campaign;
		if (!campaignSnap.exists()) {
			campaign = {
				id: campaignId,
				code: 'HAUNTED',
				slotsTotal: 1000,
				claimedCount: 0,
				active: true,
			};
			transaction.set(campaignRef, campaign);
		} else {
			campaign = campaignSnap.data();
			if (campaign.active === false) {
				const err = new Error('No active whitelist hunt right now');
				err.code = CLAIM_ERRORS.CAMPAIGN_INACTIVE;
				throw err;
			}
		}

		if (
			code &&
			code.trim().toUpperCase() !== String(campaign.code).trim().toUpperCase()
		) {
			const err = new Error('Incorrect code');
			err.code = CLAIM_ERRORS.WRONG_CODE;
			throw err;
		}

		const claimedCount = campaign.claimedCount || 0;
		const slotsTotal = campaign.slotsTotal || 0;

		if (claimedCount >= slotsTotal) {
			const err = new Error('All whitelist spots for today are gone');
			err.code = CLAIM_ERRORS.SOLD_OUT;
			throw err;
		}

		const claimNumber = claimedCount + 1;

		transaction.set(claimRef, {
			twitterHandle: sanitizedHandle,
			walletAddress: walletAddress.trim(),
			quoteTweetLink: quoteTweetLink ? quoteTweetLink.trim() : null,
			campaignId,
			claimNumber,
			createdAt: serverTimestamp(),
		});

		transaction.update(campaignRef, {
			claimedCount: claimNumber,
		});

		return { claimNumber, slotsTotal, campaignId };
	});
};
