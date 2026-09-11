import React, { useState } from 'react';
import { supabase } from '../../../supabase/config';

const WINNERS = {
	"0x345e1a371a0a5a021ac29075ff5f624560bf3821": "🍎 $15 Worth of Apple Inc. (AAPL) Stock",
	"0x9e1498098f71260cbc2bb0b6ae1068d618ba26e5": "🟢 $12 Worth of NVIDIA Corporation (NVDA) Stock",
	"0x653772ed9db68dc9f85bd216bc36bdcba6e7cbd7": "🚗 $10 Worth of Tesla, Inc. (TSLA) Stock",
	"0x97944fa8ec5c63f3073a02d36c84f9002e851b10": "📦 $8 Worth of Amazon.com, Inc. (AMZN) Stock",
	"0x7ffd590b6f044a04e0f393987f8261ecde5a1fa1": "💻 $5 Worth of Microsoft Corporation (MSFT) Stock",
	"0xc0d5ca5c9a43668a0c85ab939b63fd6e0875a997": "🩸 1873 $HH Token Pack",
	"0x653fca49dabb51be88d8b4ac435fc0b847a6e9bf": "🩸 1683 $HH Token Pack",
	"0xd52f9f3ffe3e19d5a7a9a08234f3a01acfa4dcaa": "🩸 1494 $HH Token Pack",
	"0x9398b40726ee913f047c3b7d8da91d6f811f227c": "🩸 1337 $HH Token Pack",
	"0x9f7d4b7cac7543cd5098265209ed4a2b7aa43626": "🩸 1276 $HH Token Pack",
	"0x432919964c3e048b51f8fe5e348aa11841c2cf10": "🩸 1137 $HH Token Pack",
	"0xe2715c44a079c129bb9efc966209d772bfa639c8": "🩸 1111 $HH Token Pack",
	"0x9ec72c5f49e1c6f7286c5df7481dd802585b82f3": "🕸️ Free Haunting Hoods NFT",
	"0xff81985aaba768269ffe591611afe499dab7242c": "🕸️ Free Haunting Hoods NFT",
	"0xbf276d788225966cefe338a54c771c9a1baae135": "🕸️ Free Haunting Hoods NFT"
};

export default function RaffleRewardChecker() {
	const [address, setAddress] = useState('');
	const [status, setStatus] = useState(null); // 'idle', 'checking', 'winner', 'loser', 'not_found', 'error'
	const [reward, setReward] = useState('');
	const [error, setError] = useState('');

	const checkReward = async () => {
		if (!address || !address.trim()) {
			setError('Please enter a wallet address.');
			setStatus('error');
			return;
		}

		setStatus('checking');
		setError('');
		setReward('');
		
		const cleanAddress = address.trim().toLowerCase();

		// 1. Check if they are a winner
		if (WINNERS[cleanAddress]) {
			setReward(WINNERS[cleanAddress]);
			setStatus('winner');
			return;
		}

		// 2. Not a winner, check if they actually entered the raffle
		try {
			if (!supabase) {
				// Fallback if supabase isn't configured locally
				setStatus('not_found');
				return;
			}
			
			// We have to fetch and filter locally since JSONB querying can be finicky depending on the exact schema
			// This is fine since it's a small dataset for a raffle
			const { data: entries, error: fetchError } = await supabase
				.from('raffle_entries')
				.select('data');
				
			if (fetchError) throw fetchError;
			
			const didEnter = entries?.some(entry => 
				entry.data?.walletAddress?.toLowerCase() === cleanAddress
			);

			if (didEnter) {
				setStatus('loser');
			} else {
				setStatus('not_found');
			}
		} catch (err) {
			console.error('Error checking raffle entries:', err);
			setError('Error checking database. Please try again.');
			setStatus('error');
		}
	};

	return (
		<section className="wl-application-section" id="raffle-rewards" style={{ paddingTop: '1rem', marginTop: '2rem' }}>
			<div className="wl-app-container">
				<div className="wl-app-header">
					<p className="eyebrow" style={{ color: '#9146FF' }}>RAFFLE RESULTS</p>
					<h2>CHECK REWARDS.</h2>
					<p className="wl-app-subtitle">
						Enter your wallet address to see if you secured a reward from the OG Partner Raffle.
					</p>
				</div>

				<div className="wl-details-section">
					<div className="wl-address-input-group" style={{ marginTop: '0', paddingTop: '0', borderTop: 'none' }}>
						<div className="wl-address-label">
							<strong>WALLET ADDRESS</strong>
							<span>check your status</span>
						</div>
						<input 
							type="text" 
							className="wl-address-input" 
							placeholder="Paste your ETH address..." 
							value={address}
							onChange={(e) => setAddress(e.target.value)}
							disabled={status === 'checking'}
						/>
					</div>
				</div>

				{status === 'error' && (
					<div className="wl-error" style={{color: '#ff4d4d', marginTop: '1rem', textAlign: 'center'}}>
						{error}
					</div>
				)}

				<div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
					{status === 'winner' && (
						<div style={{ padding: '2rem', border: '1px solid #00e676', backgroundColor: 'rgba(0, 230, 118, 0.1)', marginBottom: '1.5rem' }}>
							<h3 style={{ color: '#00e676', fontSize: '1.5rem', margin: '0 0 1rem' }}>🎉 YOU WON! 🎉</h3>
							<p style={{ color: '#fff', fontSize: '1.2rem', margin: 0 }}>{reward}</p>
						</div>
					)}
					
					{status === 'loser' && (
						<div style={{ padding: '2rem', border: '1px solid #ff4d4d', backgroundColor: 'rgba(255, 77, 77, 0.1)', marginBottom: '1.5rem' }}>
							<h3 style={{ color: '#ff4d4d', fontSize: '1.2rem', margin: '0 0 0.5rem' }}>BETTER LUCK NEXT TIME.</h3>
							<p style={{ color: '#aaa', fontSize: '0.9rem', margin: 0 }}>Your entry was found, but you didn't win this time.</p>
						</div>
					)}

					{status === 'not_found' && (
						<div style={{ padding: '2rem', border: '1px solid #747474', backgroundColor: 'rgba(116, 116, 116, 0.1)', marginBottom: '1.5rem' }}>
							<h3 style={{ color: '#747474', fontSize: '1.2rem', margin: '0 0 0.5rem' }}>ENTRY NOT FOUND.</h3>
							<p style={{ color: '#aaa', fontSize: '0.9rem', margin: 0 }}>We couldn't find this wallet address in the raffle entries.</p>
						</div>
					)}

					<button 
						className="wl-submit-btn" 
						onClick={checkReward}
						disabled={status === 'checking' || !address.trim()}
						style={{ backgroundColor: '#9146FF', borderColor: '#9146FF', color: 'white', opacity: status === 'checking' ? 0.7 : 1 }}
					>
						{status === 'checking' ? 'CHECKING...' : 'CHECK ELIGIBILITY'} <span>✦</span>
					</button>
				</div>
			</div>
		</section>
	);
}
