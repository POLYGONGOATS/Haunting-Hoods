import React, { useState, useEffect } from 'react';
import './RaffleSection.css'; // We will create this
import useWhitelist from '../../../hooks/useWhitelist';


const CountdownTimer = ({ endTimeMs }) => {
	const [timeLeft, setTimeLeft] = useState('');

	useEffect(() => {
		const updateTimer = () => {
			const now = Date.now();
			const diff = endTimeMs - now;

			if (diff <= 0) {
				setTimeLeft('ENDED');
				return;
			}

			const hours = Math.floor(diff / (1000 * 60 * 60));
			const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
			const seconds = Math.floor((diff % (1000 * 60)) / 1000);

			setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
		};

		updateTimer();
		const interval = setInterval(updateTimer, 1000);
		return () => clearInterval(interval);
	}, [endTimeMs]);

	return <span>{timeLeft}</span>;
};

export default function RaffleSection() {
	const [isConnecting, setIsConnecting] = useState(false);
	const [status, setStatus] = useState(null); // 'checking', 'success', 'error'
	const [errorMessage, setErrorMessage] = useState('');
	const { walletAddress, setWalletAddress } = useWhitelist(); // Re-use wallet state

	useEffect(() => {
		// Check for OAuth callback
		const urlParams = new URLSearchParams(window.location.search);
		const code = urlParams.get('code');
		const state = urlParams.get('state');

		if (code && state === 'discord-raffle') {
			verifyDiscordRole(code);
			// Clean up URL
			window.history.replaceState({}, document.title, window.location.pathname);
		}
	}, []);

	const handleDiscordConnect = () => {
		if (!walletAddress || !walletAddress.trim()) {
			setErrorMessage('Please enter your wallet address first.');
			setStatus('error');
			return;
		}

		setIsConnecting(true);
		
		const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID;
		if (!clientId) {
			setErrorMessage('Discord Client ID is missing from configuration.');
			setStatus('error');
			setIsConnecting(false);
			return;
		}

		const redirectUri = encodeURIComponent(window.location.origin);
		const oauthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify%20guilds.members.read&state=discord-raffle`;
		
		// Save wallet to local storage so we have it after redirect
		localStorage.setItem('raffle_wallet', walletAddress);
		
		window.location.href = oauthUrl;
	};

	const verifyDiscordRole = async (code) => {
		setStatus('checking');
		setErrorMessage('');
		
		const savedWallet = localStorage.getItem('raffle_wallet') || '';
		
		try {
			const response = await fetch('/api/discord-auth', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					code,
					redirectUri: window.location.origin,
					walletAddress: savedWallet,
				})
			});
			
			const data = await response.json();
			
			if (!response.ok) {
				setErrorMessage(data.error || 'Verification failed.');
				setStatus('error');
			} else {
				setStatus('success');
			}
		} catch (error) {
			console.error('Raffle entry error:', error);
			setErrorMessage('Network error while verifying Discord role.');
			setStatus('error');
		}
	};

	return (
		<section className="wl-application-section" id="og-raffle" style={{ paddingTop: '1rem' }}>
			<div className="wl-app-container">
				<div className="wl-app-header">
					<p className="eyebrow" style={{ color: '#9146FF' }}>OG EXCLUSIVE</p>
					<h2>PARTNER RAFFLES.</h2>
					<p className="wl-app-subtitle">
						Holding the OG Pass role on Discord?<br/>Enter your wallet and connect Discord to access whitelists from upcoming partner projects.
					</p>
				</div>

				<div className="wl-tasks-section" style={{ border: '1px solid rgba(145, 70, 255, 0.3)', marginBottom: '2rem', background: 'transparent' }}>
					<div className="wl-tasks-header" style={{ color: '#9146FF', borderBottom: '1px solid rgba(145, 70, 255, 0.2)' }}>
						<span>ACTIVE RAFFLES</span>
					</div>
					<div style={{ padding: '2.5rem 1.5rem', textAlign: 'center' }}>
						<p style={{ color: '#9146FF', fontFamily: '"Space Mono", monospace', fontSize: '0.7rem', letterSpacing: '0.2em', margin: '0 0 0.6rem' }}>INCOMING</p>
						<p style={{ color: '#f5f5f5', fontSize: '1.1rem', margin: '0 0 0.5rem', letterSpacing: '0.05em' }}>Stay tuned.</p>
						<p style={{ color: '#747474', fontSize: '0.82rem', letterSpacing: '0.08em', margin: 0 }}>Projects are lined up.</p>
					</div>
				</div>

				<div className="wl-details-section">
					<div className="wl-details-header" style={{ color: '#9146FF' }}>
						<span>YOUR DETAILS</span>
					</div>
					
					<div className="wl-address-input-group" style={{ marginTop: '0', paddingTop: '0', borderTop: 'none' }}>
						<div className="wl-address-label">
							<strong>WALLET ADDRESS</strong>
							<span>where we drop the spoils</span>
						</div>
						<input 
							type="text" 
							className="wl-address-input" 
							placeholder="Submit your ETH address..." 
							value={walletAddress}
							onChange={(e) => setWalletAddress(e.target.value)}
							disabled={status === 'success' || status === 'checking'}
						/>
					</div>
				</div>

				{status === 'error' && (
					<div className="wl-error" style={{color: '#ff4d4d', marginTop: '1rem', textAlign: 'center'}}>
						{errorMessage}
					</div>
				)}

				{status === 'success' ? (
					<button className="wl-submit-btn claimed" disabled style={{ backgroundColor: '#9146FF', color: 'white', border: '1px solid #9146FF' }}>
						SUCCESSFULLY ENTERED RAFFLE <span>✓</span>
					</button>
				) : (
					<button 
						className="wl-submit-btn" 
						onClick={handleDiscordConnect}
						disabled={status === 'checking' || isConnecting || !walletAddress.trim()}
						style={{ backgroundColor: 'transparent', borderColor: '#9146FF', color: '#9146FF' }}
					>
						{status === 'checking' || isConnecting ? 'VERIFYING...' : 'VERIFY DISCORD ROLE'} <span>✦</span>
					</button>
				)}
			</div>
		</section>
	);
}
