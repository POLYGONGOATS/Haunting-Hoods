import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getSealEngineState, feedSealEngine } from '../supabase/sealEngineService';

const useSealEngine = create(
	persist(
		(set, get) => ({
			// Global State
			totalMarksFed: 0,
			targetMarks: 4444,
			isBroken: false,
			
			// User Local State
			userMarks: 0,
			foundHoods: [],
			hasFoundHoods: false,
			hasJoinedDiscord: false,
			hasLikedTweet: false,
			hasReposted: false,
			hasCommented: false,
			hasMadeTweet: false,
			hasSubmittedAddress: false,
			savedWallet: '',
			savedTwitter: '',
			
			// Machine State for animation orchestration
			// 'idle' | 'feeding' | 'dispensing'
			machineState: 'idle',
			
			fetchGlobalState: async () => {
				try {
					const state = await getSealEngineState();
					set({
						totalMarksFed: state.total_marks_fed,
						targetMarks: state.target_marks,
						isBroken: state.is_broken
					});
				} catch (error) {
					console.error("Failed to fetch seal engine state:", error);
				}
			},

			// Task Actions
			spotHood: (hoodId) => set((state) => {
				if (state.hasFoundHoods || state.foundHoods.includes(hoodId)) return state;
				
				const newFound = [...state.foundHoods, hoodId];
				const isComplete = newFound.length >= 4;

				return {
					foundHoods: newFound,
					hasFoundHoods: isComplete,
					userMarks: isComplete ? state.userMarks + 444 : state.userMarks
				};
			}),
			
			completeDiscordTask: () => set((state) => ({ 
				hasJoinedDiscord: true, 
				userMarks: state.userMarks + 666 
			})),

			completeLikeTask: () => set((state) => ({ 
				hasLikedTweet: true, 
				userMarks: state.userMarks + 666 
			})),

			completeRepostTask: () => set((state) => ({ 
				hasReposted: true, 
				userMarks: state.userMarks + 666 
			})),

			completeCommentTask: () => set((state) => ({ 
				hasCommented: true, 
				userMarks: state.userMarks + 666 
			})),

			completeMakeTweetTask: () => set((state) => ({ 
				hasMadeTweet: true, 
				userMarks: state.userMarks + 666 
			})),
			
			completeAddressTask: (wallet, twitter) => set((state) => ({ 
				hasSubmittedAddress: true, 
				savedWallet: wallet,
				savedTwitter: twitter,
				userMarks: state.userMarks + 670 
			})),

			// Engine Interactions
			feedEngine: async () => {
				const { userMarks, savedWallet, savedTwitter } = get();
				const amount = userMarks;
				if (userMarks <= 0) return;

				set({ machineState: 'feeding' });
				
				try {
					const result = await feedSealEngine(savedWallet || '0xUNKNOWN', savedTwitter || '@unknown', amount);
					
					if (result.success) {
						// Deduct marks locally since they've been fed
						set(state => ({ 
							userMarks: state.userMarks - amount,
							totalMarksFed: result.total_marks_fed,
							isBroken: result.is_broken
						}));

						// Trigger dispense animation (or shake)
						set({ machineState: 'dispensing' });
						
						// Auto-reset back to idle after sequence completes
						setTimeout(() => {
							set({ machineState: 'idle' });
						}, 4000);
					} else {
						// Handle error (e.g. already broken)
						console.error(result.error);
						if (result.error === 'The seal is already broken.') {
							get().fetchGlobalState();
						} else {
							alert(`Failed to feed engine: ${result.error || 'Unknown error'}`);
						}
						set({ machineState: 'idle' });
					}
				} catch (error) {
					console.error("Error feeding engine:", error);
					alert(`Database error: ${error.message || 'Please check your connection and Supabase permissions.'}`);
					set({ machineState: 'idle' });
				}
			},

			resetMachine: () => {
				set({ machineState: 'idle' });
			}
		}),
		{
			name: 'seal-engine-storage-v2',
			partialize: (state) => ({ 
				userMarks: state.userMarks,
				foundHoods: state.foundHoods,
				hasFoundHoods: state.hasFoundHoods,
				hasJoinedDiscord: state.hasJoinedDiscord,
				hasLikedTweet: state.hasLikedTweet,
				hasReposted: state.hasReposted,
				hasCommented: state.hasCommented,
				hasMadeTweet: state.hasMadeTweet,
				hasSubmittedAddress: state.hasSubmittedAddress
			}),
		}
	)
);

export default useSealEngine;
