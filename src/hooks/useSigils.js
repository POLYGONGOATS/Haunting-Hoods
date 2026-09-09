import { create } from 'zustand';

// All possible locations where a sigil could appear.
export const ALL_SPOT_IDS = [
	'landing-hero', 'landing-collection', 'landing-footer',
	'lore-header', 'lore-middle', 'lore-footer',
	'utility-top', 'utility-middle', 'utility-bottom',
	'whitelist-form', 'whitelist-footer'
];

// Generate a random mark code like HH-7A9X-14
function generateMarkCode() {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	const randomSegment = (len) => Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
	return `HH-${randomSegment(4)}-${randomSegment(2)}`;
}

const loadState = () => {
	try {
		const saved = localStorage.getItem('haunting_hoods_sigils');
		if (saved) {
			const parsed = JSON.parse(saved);
			if (!parsed.spotMapping) {
				const shuffledSpots = [...ALL_SPOT_IDS].sort(() => 0.5 - Math.random());
				parsed.spotMapping = {};
				for (let i = 0; i < 6; i++) {
					parsed.spotMapping[shuffledSpots[i]] = i + 1;
				}
				localStorage.setItem('haunting_hoods_sigils', JSON.stringify(parsed));
			}
			return parsed;
		}
	} catch (e) {
		console.error("Failed to load sigils from local storage", e);
	}
	
	// First time visit: generate random placements
	const shuffledSpots = [...ALL_SPOT_IDS].sort(() => 0.5 - Math.random());
	const spotMapping = {}; // spotId -> sigilId (1 to 6)
	for (let i = 0; i < 6; i++) {
		spotMapping[shuffledSpots[i]] = i + 1;
	}

	return { collectedSigils: [], markCode: null, spotMapping };
};

const saveState = (state) => {
	try {
		localStorage.setItem('haunting_hoods_sigils', JSON.stringify({
			collectedSigils: state.collectedSigils,
			markCode: state.markCode,
			spotMapping: state.spotMapping
		}));
	} catch (e) {
		console.error("Failed to save sigils to local storage", e);
	}
};

const useSigils = create((set, get) => ({
	collectedSigils: loadState().collectedSigils,
	markCode: loadState().markCode,
	spotMapping: loadState().spotMapping,
	cinematicActive: loadState().collectedSigils.length >= 6 && !loadState().markCode,

	initCheck: () => {
		const { collectedSigils, markCode, spotMapping } = get();
		if (collectedSigils.length >= 6 && !markCode) {
			const newMarkCode = generateMarkCode();
			set({ markCode: newMarkCode, cinematicActive: true });
			saveState({ collectedSigils, markCode: newMarkCode, spotMapping });
		}
	},

	collectSigil: (id) => {
		const { collectedSigils, markCode, spotMapping } = get();
		if (!collectedSigils.includes(id)) {
			const updatedSigils = [...collectedSigils, id];
			let newMarkCode = markCode;
			let triggersCinematic = false;

			if (updatedSigils.length === 6 && !markCode) {
				newMarkCode = generateMarkCode();
				triggersCinematic = true;
			}

			set({ 
				collectedSigils: updatedSigils, 
				markCode: newMarkCode,
				cinematicActive: triggersCinematic
			});

			saveState({ collectedSigils: updatedSigils, markCode: newMarkCode, spotMapping });
		}
	},

	closeCinematic: () => set({ cinematicActive: false }),

	// For admin/testing
	resetSigils: () => {
		const shuffledSpots = [...ALL_SPOT_IDS].sort(() => 0.5 - Math.random());
		const spotMapping = {};
		for (let i = 0; i < 6; i++) {
			spotMapping[shuffledSpots[i]] = i + 1;
		}
		set({ collectedSigils: [], markCode: null, cinematicActive: false, spotMapping });
		saveState({ collectedSigils: [], markCode: null, spotMapping });
	}
}));

export default useSigils;
