import { create } from 'zustand';
import {
	getTodayCampaign,
	claimWhitelistSpot,
	CLAIM_ERRORS,
} from '../firebase/whitelistService';

const useWhitelist = create((set, get) => ({
	campaign: null,
	campaignLoading: true,
	claiming: false,
	claimResult: null, // { claimNumber, slotsTotal }
	claimError: null,
	twitterHandle: '',
	setTwitterHandle: (value) => set({ twitterHandle: value }),
	walletAddress: '',
	setWalletAddress: (value) => set({ walletAddress: value }),
	quoteTweetLink: '',
	setQuoteTweetLink: (value) => set({ quoteTweetLink: value }),

	// Set true once the player scratches the paint off the wall in-game.
	codeRevealed: false,
	revealCode: () => set({ codeRevealed: true }),

	isClaimPanelOpen: false,
	claimPanelRequiresCode: true,
	openClaimPanel: (requiresCode = true) =>
		set({ isClaimPanelOpen: true, claimPanelRequiresCode: requiresCode }),
	closeClaimPanel: () => set({ isClaimPanelOpen: false }),

	init: () => {
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

	resetDatabase: async () => {
		set({ claimResult: null });
		get().refreshCampaign();
	},

	submitClaim: async (code) => {
		const { twitterHandle, walletAddress, quoteTweetLink } = get();
		if (!twitterHandle.trim()) {
			set({ claimError: 'Twitter handle is required' });
			return;
		}

		set({ claiming: true, claimError: null });
		try {
			const result = await claimWhitelistSpot({
				twitterHandle,
				walletAddress,
				quoteTweetLink,
				code,
			});
			set({
				claiming: false,
				claimResult: result,
			});
			get().refreshCampaign();
		} catch (error) {
			set({ claiming: false, claimError: error.code || error.message || 'UNKNOWN' });
		}
	},
}));

export { CLAIM_ERRORS };
export default useWhitelist;
