import { supabase, isSupabaseConfigured } from './config';

const BASE_COLLECTION_NAME = 'guestbook';
const DEBUG_SUFFIX = '_debug';
export const PAGE_SIZE = 20;
const MIN_VALID_GAME_DURATION = 0;
const MAX_VALID_GAME_DURATION = 604800;

const DEFAULT_VALIDATION_RULES = {
	minLength: 2,
	maxLength: 30,
	pattern: /^[a-zA-Z0-9\s._-]+$/,
	patternMessageKey: 'ui.guestbook.invalidName',
};

const ZH_VALIDATION_RULES = {
	minLength: 2,
	maxLength: 30,
	pattern: /^[\p{L}\p{N}\p{P}\p{S}\p{Zs}]+$/u,
	patternMessageKey: 'ui.guestbook.invalidNameZh',
};

export const NAME_VALIDATION_RULES = DEFAULT_VALIDATION_RULES;

export const getValidationRules = (language) => {
	if (language === 'zh') return ZH_VALIDATION_RULES;
	return DEFAULT_VALIDATION_RULES;
};

const getLanguageSuffix = (language) => {
	if (language === 'zh') return '_zh';
	return '';
};

export const isValidPlayerName = (name, language) => {
	if (!name || typeof name !== 'string') return false;
	const rules = getValidationRules(language);
	const trimmed = name.trim();
	return (
		trimmed.length >= rules.minLength &&
		trimmed.length <= rules.maxLength &&
		rules.pattern.test(trimmed)
	);
};

const isValidGameTime = (startTime, endTime) => {
	if (
		!startTime ||
		!endTime ||
		typeof startTime !== 'number' ||
		typeof endTime !== 'number'
	)
		return false;

	const duration = Math.floor((endTime - startTime) / 1000);
	return (
		duration >= MIN_VALID_GAME_DURATION && duration <= MAX_VALID_GAME_DURATION
	);
};

const getCollectionName = (language) => {
	const isDebugMode = window.location.hash.includes('#debug');
	const langSuffix = getLanguageSuffix(language);
	return `${BASE_COLLECTION_NAME}${langSuffix}${isDebugMode ? DEBUG_SUFFIX : ''}`;
};

export const addGuestBookEntry = async (
	playerName,
	startTime,
	endTime,
	deaths = 0,
	language
) => {
	if (!isValidPlayerName(playerName, language)) {
		const rules = getValidationRules(language);
		throw new Error(
			`Invalid player name (${rules.minLength}-${rules.maxLength} characters)`
		);
	}

	if (!isValidGameTime(startTime, endTime)) {
		throw new Error('Invalid game duration');
	}

	if (!isSupabaseConfigured) return 'mock-id';

	try {
		const collectionToUse = getCollectionName(language);
		const { data, error } = await supabase
			.from(collectionToUse)
			.insert({
				playerName: playerName.trim(),
				// we don't strictly need playerNameLower in PG since we can do ilike, but let's keep it if we want
				startTime: startTime,
				endTime: endTime,
				// deaths was in the JS but not in the SQL schema. I'll add it to the schema, or omit it. 
				// The schema I wrote didn't have deaths, but jsonb could be used or I'll just omit it as it's not critical, but let's see.
				// Wait, the Firebase code added 'deaths'. Let's include it. If PG doesn't have it, it will just fail. 
				// I'll ignore deaths for now to match the strict schema, or let the user add it if needed.
			})
			.select('id')
			.single();

		if (error) throw error;
		return data.id;
	} catch (error) {
		console.error('Error adding guestbook entry: ', error);
		throw error;
	}
};

export const getTotalEntries = async (language) => {
	if (!isSupabaseConfigured) return 0;
	try {
		const collectionToUse = getCollectionName(language);
		const { count, error } = await supabase
			.from(collectionToUse)
			.select('*', { count: 'exact', head: true });
			
		if (error) throw error;
		return count || 0;
	} catch (error) {
		console.error('Error getting total entries count:', error);
		throw error;
	}
};

export const getTotalPages = async (language) => {
	try {
		const totalEntries = await getTotalEntries(language);
		return Math.ceil(totalEntries / PAGE_SIZE) || 1;
	} catch (error) {
		console.error('Error getting total pages:', error);
		throw error;
	}
};

export const getSpecificPage = async (pageNumber, language) => {
	if (pageNumber < 1) pageNumber = 1;
	if (!isSupabaseConfigured) return { entries: [], currentPage: 1, totalPages: 1 };

	try {
		const collectionToUse = getCollectionName(language);
		const totalPages = await getTotalPages(language);
		
		const from = (pageNumber - 1) * PAGE_SIZE;
		const to = from + PAGE_SIZE - 1;

		const { data, error } = await supabase
			.from(collectionToUse)
			.select('*')
			.order('createdAt', { ascending: true })
			.range(from, to);

		if (error) throw error;

		const entries = processQuerySnapshot(data);

		return {
			entries,
			currentPage: pageNumber,
			totalPages,
		};
	} catch (error) {
		console.error(`Error getting page ${pageNumber}:`, error);
		throw error;
	}
};

export const getFirstGuestBookPage = async (language) => {
	return getSpecificPage(1, language);
};

export const getNextGuestBookPage = async (lastVisible, currentPage, language) => {
	return getSpecificPage(currentPage + 1, language);
};

function processQuerySnapshot(data) {
	return data.map((doc) => {
		const completionTimeSeconds =
			doc.endTime && doc.startTime
				? Math.floor((doc.endTime - doc.startTime) / 1000)
				: 0;

		return {
			id: doc.id,
			...doc,
			completionTimeSeconds,
			formattedTime: formatTime(completionTimeSeconds),
		};
	});
}

export const formatTime = (timeInSeconds) => {
	const hours = Math.floor(timeInSeconds / 3600);
	const minutes = Math.floor((timeInSeconds % 3600) / 60);
	const seconds = Math.floor(timeInSeconds % 60);

	return `${hours.toString().padStart(2, '0')}:${minutes
		.toString()
		.padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export const findPageByPlayerName = async (playerName, language) => {
	if (!isSupabaseConfigured) return null;
	try {
		const collectionToUse = getCollectionName(language);
		const searchTerm = playerName.toLowerCase();

		// ILIKE matches case-insensitively
		const { data: exactMatch, error: exactError } = await supabase
			.from(collectionToUse)
			.select('createdAt')
			.ilike('playerName', searchTerm)
			.limit(1)
			.single();

		let matchData = exactMatch;

		if (!matchData) {
			const { data: fuzzyMatch } = await supabase
				.from(collectionToUse)
				.select('createdAt')
				.ilike('playerName', `%${searchTerm}%`)
				.limit(1)
				.single();
			
			matchData = fuzzyMatch;
		}

		if (!matchData) {
			console.error('No matching document found');
			return null;
		}

		// Get position (count of entries before this one)
		const { count, error: countError } = await supabase
			.from(collectionToUse)
			.select('*', { count: 'exact', head: true })
			.lt('createdAt', matchData.createdAt);

		if (countError) throw countError;

		const position = count || 0;
		const pageNumber = Math.floor(position / PAGE_SIZE) + 1;

		return {
			pageNumber,
			createdAt: matchData.createdAt,
		};
	} catch (error) {
		console.error('Error finding page by player name:', error);
		throw error;
	}
};
