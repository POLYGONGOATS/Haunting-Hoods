import React, { useState } from 'react';
import { supabase } from '../../../supabase/config';
import SigilPlacement from '../Story/SigilPlacement';
import './RaffleSection.css'; // Reuse some of the styling if possible, but mostly inline

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
	const [status, setStatus] = useState(null);
	const [reward, setReward] = useState('');
	const [error, setError] = useState('');
	const [claimStep, setClaimStep] = useState(0); // 0: initial, 1: twitter, 2: discord

	const checkReward = async () => {
		if (!address || !address.trim()) {
			setError('A WALLET ADDRESS IS REQUIRED.');
			setStatus('error');
			return;
		}

		setStatus('checking');
		setError('');
		setReward('');
		setClaimStep(0);
		
		const cleanAddress = address.trim().toLowerCase();

		setTimeout(async () => {
			if (WINNERS[cleanAddress]) {
				setReward(WINNERS[cleanAddress]);
				setStatus('winner');
				return;
			}

			try {
				if (!supabase) {
					setStatus('not_found');
					return;
				}
				
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
				setError('THE ARCHIVES ARE CORRUPTED. TRY AGAIN.');
				setStatus('error');
			}
		}, 800); // Artificial delay for spooky suspense
	};

	const handleClaimInitiate = () => {
		setClaimStep(1);
	};

	const handleTweetClick = () => {
		const tweetText = `I have got ${reward}, privileged being an holder of Haunting Hoods OG.\n\n#HauntingHoods #OGPass`;
		const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
		window.open(url, '_blank');
		
		// Advance to next step after they click tweet
		setTimeout(() => {
			setClaimStep(2);
		}, 1000);
	};

	return (
		<section className="wl-application-section" id="raffle-rewards" style={{ paddingTop: '1rem' }}>
			<div className="wl-app-container" style={{ 
				border: '1px solid rgba(255, 77, 77, 0.2)', 
				background: 'rgba(10, 0, 0, 0.6)', 
				backdropFilter: 'blur(10px)',
				boxShadow: '0 0 40px rgba(138, 3, 3, 0.1)',
				position: 'relative'
			}}>
				<SigilPlacement spotId="rewards-top-right" style={{ position: 'absolute', top: '20px', right: '20px', opacity: 0.5 }} />
				
				<div className="wl-app-header">
					<p className="eyebrow" style={{ color: '#ff4d4d', letterSpacing: '0.4em' }}>THE VERDICT</p>
					<h2 style={{ textShadow: '0 0 10px rgba(255, 77, 77, 0.5)' }}>CHECK REWARDS.</h2>
					<p className="wl-app-subtitle" style={{ color: '#aaa' }}>
						Present your wallet address to see what the shadows have left for you.
					</p>
				</div>

				<div className="wl-details-section" style={{ borderTop: '1px solid rgba(255, 77, 77, 0.2)' }}>
					<div className="wl-address-input-group" style={{ marginTop: '0', paddingTop: '1rem', borderTop: 'none' }}>
						<div className="wl-address-label">
							<strong style={{ color: '#ff4d4d' }}>WALLET ADDRESS</strong>
							<span style={{ color: '#747474' }}>reveal your fate</span>
						</div>
						<input 
							type="text" 
							className="wl-address-input" 
							placeholder="Submit your ETH address..." 
							value={address}
							onChange={(e) => setAddress(e.target.value)}
							disabled={status === 'checking'}
							style={{ 
								background: 'rgba(0,0,0,0.5)', 
								borderColor: 'rgba(255, 77, 77, 0.3)',
								color: '#f5f5f5'
							}}
							onFocus={(e) => e.target.style.borderColor = '#ff4d4d'}
							onBlur={(e) => e.target.style.borderColor = 'rgba(255, 77, 77, 0.3)'}
						/>
					</div>
				</div>

				{status === 'error' && (
					<div className="wl-error" style={{
						color: '#ff4d4d', 
						marginTop: '1rem', 
						textAlign: 'center', 
						fontFamily: '"Space Mono", monospace',
						letterSpacing: '0.1em',
						textShadow: '0 0 5px rgba(255, 77, 77, 0.5)'
					}}>
						[ERROR] {error}
					</div>
				)}

				<div style={{ marginTop: '2rem', textAlign: 'center' }}>
					{status === 'winner' && (
						<div style={{ 
							padding: '2.5rem', 
							border: '1px solid #ff4d4d', 
							backgroundColor: 'rgba(69, 23, 23, 0.4)', 
							marginBottom: '2rem',
							boxShadow: '0 0 20px rgba(255, 77, 77, 0.2) inset'
						}}>
							{claimStep === 0 && (
								<>
									<h3 style={{ color: '#ff4d4d', fontSize: '1.8rem', margin: '0 0 1rem', letterSpacing: '0.1em' }}>YOU HAVE BEEN CHOSEN.</h3>
									<p style={{ color: '#fff', fontSize: '1.3rem', margin: '0 0 1.5rem', fontFamily: '"Space Mono", monospace' }}>{reward}</p>
									<button 
										onClick={handleClaimInitiate}
										style={{
											background: '#ff4d4d',
											color: '#111',
											border: 'none',
											padding: '0.8rem 2rem',
											fontSize: '0.9rem',
											letterSpacing: '0.15em',
											cursor: 'pointer',
											fontWeight: 'bold',
											transition: 'all 0.2s',
											boxShadow: '0 0 15px rgba(255, 77, 77, 0.4)'
										}}
										onMouseEnter={e => e.target.style.boxShadow = '0 0 25px rgba(255, 77, 77, 0.8)'}
										onMouseLeave={e => e.target.style.boxShadow = '0 0 15px rgba(255, 77, 77, 0.4)'}
									>
										CLAIM REWARD
									</button>
								</>
							)}

							{claimStep === 1 && (
								<div style={{ animation: 'fadeIn 0.5s ease-out' }}>
									<h3 style={{ color: '#ff4d4d', fontSize: '1.4rem', margin: '0 0 1rem', letterSpacing: '0.1em' }}>HOLD ON.</h3>
									<p style={{ color: '#ccc', fontSize: '0.9rem', margin: '0 0 1.5rem', fontFamily: '"Space Mono", monospace', lineHeight: 1.6 }}>
										Before the shadows grant your request, you must spread the word.<br/>
										Tweet your triumph to proceed.
									</p>
									<button 
										onClick={handleTweetClick}
										style={{
											background: 'transparent',
											color: '#1da1f2',
											border: '1px solid #1da1f2',
											padding: '0.8rem 2rem',
											fontSize: '0.9rem',
											letterSpacing: '0.15em',
											cursor: 'pointer',
											fontWeight: 'bold',
											transition: 'all 0.2s'
										}}
										onMouseEnter={e => { e.target.style.background = '#1da1f2'; e.target.style.color = '#fff'; }}
										onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#1da1f2'; }}
									>
										TWEET TO CLAIM
									</button>
								</div>
							)}

							{claimStep === 2 && (
								<div style={{ animation: 'fadeIn 0.5s ease-out' }}>
									<h3 style={{ color: '#ff4d4d', fontSize: '1.4rem', margin: '0 0 1rem', letterSpacing: '0.1em' }}>THE FINAL STEP.</h3>
									<p style={{ color: '#ccc', fontSize: '0.9rem', margin: '0 0 1.5rem', fontFamily: '"Space Mono", monospace', lineHeight: 1.6 }}>
										Create a ticket in the official Discord and show proof of your tweet to the admins.<br/>
										Your reward will be bestowed upon you.
									</p>
									<a 
										href="https://discord.gg/hauntinghoods" 
										target="_blank" 
										rel="noopener noreferrer"
										style={{
											display: 'inline-block',
											background: '#5865F2',
											color: '#fff',
											textDecoration: 'none',
											border: 'none',
											padding: '0.8rem 2rem',
											fontSize: '0.9rem',
											letterSpacing: '0.15em',
											cursor: 'pointer',
											fontWeight: 'bold',
											transition: 'all 0.2s'
										}}
										onMouseEnter={e => e.target.style.background = '#4752C4'}
										onMouseLeave={e => e.target.style.background = '#5865F2'}
									>
										OPEN DISCORD
									</a>
								</div>
							)}
						</div>
					)}
					
					{status === 'loser' && (
						<div style={{ 
							padding: '2.5rem', 
							border: '1px solid #3a3a3a', 
							backgroundColor: 'rgba(10, 10, 10, 0.8)', 
							marginBottom: '2rem'
						}}>
							<h3 style={{ color: '#747474', fontSize: '1.2rem', margin: '0 0 0.8rem', letterSpacing: '0.1em' }}>THE SHADOWS REMAIN EMPTY.</h3>
							<p style={{ color: '#555', fontSize: '0.9rem', margin: 0, fontFamily: '"Space Mono", monospace' }}>Your entry was found, but you secured no reward this time.</p>
						</div>
					)}

					{status === 'not_found' && (
						<div style={{ 
							padding: '2.5rem', 
							border: '1px dashed #ff4d4d', 
							backgroundColor: 'rgba(255, 77, 77, 0.05)', 
							marginBottom: '2rem'
						}}>
							<h3 style={{ color: '#ff4d4d', fontSize: '1.2rem', margin: '0 0 0.8rem', letterSpacing: '0.1em' }}>UNKNOWN ENTITY.</h3>
							<p style={{ color: '#747474', fontSize: '0.9rem', margin: 0, fontFamily: '"Space Mono", monospace' }}>This wallet does not exist in the raffle archives.</p>
						</div>
					)}

					{status !== 'winner' && (
						<button 
							className="wl-submit-btn" 
							onClick={checkReward}
							disabled={status === 'checking' || !address.trim()}
							style={{ 
								backgroundColor: status === 'checking' ? 'transparent' : '#451717', 
								borderColor: '#ff4d4d', 
								color: status === 'checking' ? '#ff4d4d' : 'white',
								transition: 'all 0.3s ease',
								opacity: (!address.trim() && status !== 'checking') ? 0.5 : 1
							}}
						>
							{status === 'checking' ? 'SEARCHING ARCHIVES...' : 'INVOKE CHECK'}
						</button>
					)}
				</div>
			</div>
			
			<style>{`
				@keyframes fadeIn {
					from { opacity: 0; transform: translateY(10px); }
					to { opacity: 1; transform: translateY(0); }
				}
			`}</style>
		</section>
	);
}
