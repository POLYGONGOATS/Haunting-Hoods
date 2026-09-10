import { create } from 'zustand';
import { submitMarkVerification } from '../supabase/whitelistService';

const loadState = () => {
	try {
		const saved = localStorage.getItem('haunting_hoods_mark_verification');
		if (saved) return JSON.parse(saved);
	} catch (e) {}
	return { alreadyClaimed: false, submittedAt: null };
};

const initialState = loadState();

const useMarkVerification = create((set) => ({
	alreadyClaimed: initialState.alreadyClaimed,
	submittedAt: initialState.submittedAt,
	claiming: false,
	claimResult: null,
	claimError: null,

	submitVerification: async (data) => {
		set({ claiming: true, claimError: null });
		try {
			const result = await submitMarkVerification(data);
			const timestamp = Date.now();
			
			set({
				claiming: false,
				claimResult: result,
				alreadyClaimed: true,
				submittedAt: timestamp
			});
			
			localStorage.setItem('haunting_hoods_mark_verification', JSON.stringify({
				alreadyClaimed: true,
				submittedAt: timestamp
			}));
		} catch (error) {
			set({ claiming: false, claimError: error.message || 'UNKNOWN' });
		}
	},
}));

export default useMarkVerification;
