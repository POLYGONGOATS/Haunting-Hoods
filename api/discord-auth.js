export default async function handler(req, res) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	const { code, redirectUri, walletAddress } = req.body;

	if (!code || !redirectUri || !walletAddress) {
		return res.status(400).json({ error: 'Missing required parameters' });
	}

	const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
	const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
	const GUILD_ID = process.env.DISCORD_GUILD_ID;
	const ROLE_ID = process.env.DISCORD_ROLE_ID;

	if (!CLIENT_ID || !CLIENT_SECRET || !GUILD_ID || !ROLE_ID) {
		return res.status(500).json({ error: 'Server configuration error: Missing Discord credentials' });
	}

	try {
		// 1. Exchange OAuth code for Access Token
		const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: new URLSearchParams({
				client_id: CLIENT_ID,
				client_secret: CLIENT_SECRET,
				grant_type: 'authorization_code',
				code: code,
				redirect_uri: redirectUri,
			}),
		});

		if (!tokenResponse.ok) {
			const errorData = await tokenResponse.json();
			console.error('Discord Token Error:', errorData);
			return res.status(400).json({ error: 'Failed to authenticate with Discord' });
		}

		const tokenData = await tokenResponse.json();
		const accessToken = tokenData.access_token;

		// 2. Fetch User Profile
		const userResponse = await fetch('https://discord.com/api/users/@me', {
			headers: { Authorization: `Bearer ${accessToken}` },
		});
		
		if (!userResponse.ok) {
			return res.status(400).json({ error: 'Failed to fetch Discord profile' });
		}
		
		const userData = await userResponse.json();
		const discordId = userData.id;

		// 3. Fetch Guild Member info to check roles
		const memberResponse = await fetch(`https://discord.com/api/users/@me/guilds/${GUILD_ID}/member`, {
			headers: { Authorization: `Bearer ${accessToken}` },
		});

		if (memberResponse.status === 404) {
			return res.status(403).json({ error: 'You are not in the required Discord server.' });
		}

		if (!memberResponse.ok) {
			return res.status(400).json({ error: 'Failed to fetch server roles' });
		}

		const memberData = await memberResponse.json();
		const roles = memberData.roles || [];

		// 4. Verify OG Role
		if (!roles.includes(ROLE_ID)) {
			return res.status(403).json({ error: 'You do not have the required OG Pass role.' });
		}

		// 5. Success - user verified! 
		// Now we would securely save to Firebase. 
		// Because this is a serverless function, we should use the Firebase Admin SDK to bypass security rules.
		
		const admin = await import('firebase-admin');
		
		if (!admin.apps.length) {
			admin.initializeApp({
				credential: admin.credential.cert({
					projectId: process.env.VITE_FIREBASE_PROJECT_ID,
					clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
					// Replace literal \n with actual newlines
					privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
				}),
			});
		}

		const db = admin.firestore();
		
		// Use Discord ID as the document ID to prevent multiple entries
		const entryRef = db.collection('raffle_entries').doc(discordId);
		const doc = await entryRef.get();
		
		if (doc.exists) {
			return res.status(400).json({ error: 'You have already entered the raffle!' });
		}

		await entryRef.set({
			discordId,
			discordUsername: userData.username,
			walletAddress: walletAddress.trim(),
			createdAt: admin.firestore.FieldValue.serverTimestamp(),
		});

		return res.status(200).json({ success: true, message: 'Successfully entered the raffle!' });

	} catch (error) {
		console.error('API Error:', error);
		return res.status(500).json({ error: 'Internal server error' });
	}
}
