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
		// Now we securely save to Supabase using the Service Role Key to bypass RLS.
		
		const { createClient } = await import('@supabase/supabase-js');
		
		const supabaseUrl = process.env.VITE_SUPABASE_URL;
		const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

		if (!supabaseUrl || !supabaseServiceKey) {
			return res.status(500).json({ error: 'Server configuration error: Missing Supabase credentials' });
		}

		const supabase = createClient(supabaseUrl, supabaseServiceKey);

		// Check if entry exists
		const { data: existingEntry } = await supabase
			.from('raffle_entries')
			.select('discordid')
			.eq('discordid', discordId)
			.single();

		if (existingEntry) {
			return res.status(400).json({ error: 'You have already entered the raffle!' });
		}

		// Insert new entry
		const { error: insertError } = await supabase
			.from('raffle_entries')
			.insert({
				discordid: discordId,
				data: {
					discordUsername: userData.username,
					walletAddress: walletAddress.trim(),
				}
			});

		if (insertError) {
			console.error('Supabase Insert Error:', insertError);
			return res.status(500).json({ error: 'Failed to save raffle entry' });
		}

		return res.status(200).json({ success: true, message: 'Successfully entered the raffle!' });

	} catch (error) {
		console.error('API Error:', error);
		return res.status(500).json({ error: 'Internal server error' });
	}
}
