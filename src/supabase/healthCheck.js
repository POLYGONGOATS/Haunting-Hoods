import { supabase, isSupabaseConfigured } from './config';

const PROBE_TIMEOUT_MS = 5000;
const PROBE_COLLECTION = 'guestbook';

let cachedResult = null;
let pendingProbe = null;

export const probeSupabaseReachability = () => {
	if (!isSupabaseConfigured) return Promise.resolve(false);
	
	if (cachedResult !== null) {
		return Promise.resolve(cachedResult);
	}
	if (pendingProbe) {
		return pendingProbe;
	}

	const probe = (async () => {
		try {
			const req = supabase.from(PROBE_COLLECTION).select('id').limit(1);
			const timeout = new Promise((_, reject) =>
				setTimeout(() => reject(new Error('supabase-probe-timeout')), PROBE_TIMEOUT_MS)
			);
			await Promise.race([req, timeout]);
			cachedResult = true;
		} catch {
			cachedResult = false;
		}
		return cachedResult;
	})();

	pendingProbe = probe;
	return probe;
};
