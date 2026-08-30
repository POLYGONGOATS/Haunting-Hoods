import { create } from 'zustand';
import {
	signInWithTwitter,
	signOutUser,
	subscribeToAuthState,
	getTodayCampaign,
	hasUserClaimedBefore,
	claimWhitelistSpot,
	CLAIM_ERRORS,
} from '../firebase/whitelistService';

const useWhitelist = create((set, get) => ({
	user: null,
	authLoading: true,
	campaign: null,
	campaignLoading: true,
	alreadyClaimed: false,
	claiming: false,
	claimResult: null, // { claimNumber, slotsTotal }
	claimError: null,
	walletAddress: '',
	setWalletAddress: (value) => set({ walletAddress: value }),

	// Set true once the player scratches the paint off the wall in-game.
	codeRevealed: false,
	revealCode: () => set({ codeRevealed: true }),

	isClaimPanelOpen: false,
	claimPanelRequiresCode: true,
	openClaimPanel: (requiresCode = true) =>
		set({ isClaimPanelOpen: true, claimPanelRequiresCode: requiresCode }),
	closeClaimPanel: () => set({ isClaimPanelOpen: false }),

	init: () => {
		subscribeToAuthState(async (user) => {
			set({ user, authLoading: false });
			if (user) {
				const claimed = await hasUserClaimedBefore(user.uid);
				set({ alreadyClaimed: claimed });
			} else {
				set({ alreadyClaimed: false });
			}
		});

		get().refreshCampaign();
	},

	refreshCampaign: async () => {
		set({ campaignLoading: true });
		try {
			const campaign = await getTodayCampaign();
			set({ campaign, campaignLoading: false });
		} catch (error) {
			console.warn('Failed to load whitelist campaign:', error);
			set({ campaign: null, campaignLoading: false });
		}
	},

	connectTwitter: async () => {
		set({ claimError: null });
		try {
			await signInWithTwitter();
		} catch (error) {
			console.warn('Twitter sign-in failed:', error);
			set({ claimError: 'TWITTER_SIGNIN_FAILED' });
		}
	},

	disconnect: async () => {
		await signOutUser();
		set({ user: null, alreadyClaimed: false, claimResult: null });
	},

	submitClaim: async (code) => {
		const { user, walletAddress } = get();
		if (!user) {
			set({ claimError: 'NOT_SIGNED_IN' });
			return;
		}

		set({ claiming: true, claimError: null });
		try {
			const result = await claimWhitelistSpot({
				uid: user.uid,
				twitterHandle: user.reloadUserInfo?.screenName || user.displayName,
				walletAddress,
				code,
			});
			set({
				claiming: false,
				claimResult: result,
				alreadyClaimed: true,
			});
			get().refreshCampaign();
		} catch (error) {
			set({ claiming: false, claimError: error.code || 'UNKNOWN' });
		}
	},
}));

export { CLAIM_ERRORS };
export default useWhitelist;
