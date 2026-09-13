// Local mock for Seal Engine when Supabase is not configured
const STORAGE_KEY = 'mock_seal_engine_stats';

const getMockState = () => {
	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored) return JSON.parse(stored);
	return { total_marks_fed: 0, target_marks: 4444, is_broken: false };
};

const saveMockState = (state) => {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const mockGetSealEngineState = async () => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(getMockState());
		}, 300);
	});
};

export const mockFeedSealEngine = async (walletAddress, twitterHandle, amount) => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			const state = getMockState();
			
			if (state.is_broken) {
				resolve({ success: false, error: 'The seal is already broken.' });
				return;
			}

			const newTotal = state.total_marks_fed + amount;
			const isBroken = newTotal >= state.target_marks;
			
			const newState = {
				...state,
				total_marks_fed: newTotal,
				is_broken: isBroken
			};
			
			saveMockState(newState);

			resolve({
				success: true,
				total_marks_fed: newTotal,
				is_broken: isBroken
			});
		}, 500);
	});
};
