/**
 * Admin script: creates/updates today's whitelist hunt campaign in Firestore.
 *
 * Each day is its own document in `whitelist_campaigns/{YYYY-MM-DD}` (UTC).
 * Run this once per day (manually, via cron, or a scheduled Cloud Function)
 * to set that day's clue code and number of first-come-first-serve slots.
 *
 * Requires a Firebase service account key with Firestore write access.
 * Usage:
 *   GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json \
 *   node scripts/createDailyWhitelistCampaign.js CODE-ON-THE-WALL 50
 */
const admin = require('firebase-admin');

const [, , code, slotsArg] = process.argv;

if (!code || !slotsArg) {
	console.error(
		'Usage: node scripts/createDailyWhitelistCampaign.js <CODE> <SLOTS_TOTAL>'
	);
	process.exit(1);
}

admin.initializeApp({
	credential: admin.credential.applicationDefault(),
});

const db = admin.firestore();

const getTodayCampaignId = () => {
	const now = new Date();
	const yyyy = now.getUTCFullYear();
	const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
	const dd = String(now.getUTCDate()).padStart(2, '0');
	return `${yyyy}-${mm}-${dd}`;
};

async function main() {
	const campaignId = getTodayCampaignId();
	const slotsTotal = parseInt(slotsArg, 10);

	await db.collection('whitelist_campaigns').doc(campaignId).set({
		code,
		slotsTotal,
		claimedCount: 0,
		active: true,
		createdAt: admin.firestore.FieldValue.serverTimestamp(),
	});

	console.log(
		`Created whitelist campaign ${campaignId}: code="${code}", slots=${slotsTotal}`
	);
	process.exit(0);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
