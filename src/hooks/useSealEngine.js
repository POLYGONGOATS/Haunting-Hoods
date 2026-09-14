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
			
			// Local engine state (no longer global)
			totalMarksFed: 0,
			targetMarks: 4444,
			isBroken: false,

			fetchGlobalState: async () => {
				// No longer fetching from global DB - it's an individual experience now.
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
					await feedSealEngine(savedWallet || '0xUNKNOWN', savedTwitter || '@unknown', amount);
					
					// Deduct marks locally since they've been fed
					set(state => ({ 
						userMarks: state.userMarks - amount
					}));

					// Set machine to dispensing
					set({ machineState: 'dispensing' });
					
					// Update local engine stats directly (since it's an individual experience)
					set({ 
						totalMarksFed: amount,
						isBroken: amount >= 4444
					});

					// Auto-reset back to idle after sequence completes
					setTimeout(() => {
						set({ machineState: 'idle' });
					}, 4000);
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
			name: 'seal-engine-storage-v3',
			partialize: (state) => ({ 
				userMarks: state.userMarks,
				foundHoods: state.foundHoods,
				hasFoundHoods: state.hasFoundHoods,
				hasJoinedDiscord: state.hasJoinedDiscord,
				hasLikedTweet: state.hasLikedTweet,
				hasReposted: state.hasReposted,
				hasCommented: state.hasCommented,
				hasMadeTweet: state.hasMadeTweet,
				hasSubmittedAddress: state.hasSubmittedAddress,
				savedWallet: state.savedWallet,
				savedTwitter: state.savedTwitter,
				totalMarksFed: state.totalMarksFed,
				isBroken: state.isBroken
			}),
			onRehydrateStorage: () => (state) => {
				// If a user's local storage got corrupted and lost their wallet details, 
				// force them to re-enter it before feeding.
				if (state && state.hasSubmittedAddress && !state.savedWallet) {
					state.hasSubmittedAddress = false;
				}
			}
		}
	)
);

export default useSealEngine;
