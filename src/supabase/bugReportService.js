import { supabase, isSupabaseConfigured } from './config';

const COLLECTION_NAME = 'bug_reports';

export const addBugReport = async (description, consoleLogs, deviceInfo) => {
	if (!isSupabaseConfigured) return 'mock-bug-report-id';
	
	try {
		const { data, error } = await supabase
			.from(COLLECTION_NAME)
			.insert({
				description,
				consoleLogs,
				deviceInfo,
			})
			.select('id')
			.single();
			
		if (error) throw error;
		return data.id;
	} catch (error) {
		console.error('Error adding bug report: ', error);
		throw error;
	}
};
