import React, { useEffect, useState } from 'react';
import SealMachine from './Machine/SealMachine';
import EngineControls from './Controls/EngineControls';
import DispenseSequence from './DispenseSequence';
import HoodPlacement from '../Story/HoodPlacement';
import useSealEngine from '../../../hooks/useSealEngine';
import './SealEngine.css';

export default function SealEnginePage() {
	const { machineState, isBroken, totalMarksFed, targetMarks, savedWallet, savedTwitter, resecureDetails } = useSealEngine();
	const [dismissTakeover, setDismissTakeover] = useState(false);
	const [resecureWallet, setResecureWallet] = useState('');
	const [resecureTwitter, setResecureTwitter] = useState('');

	const needsResecure = isBroken && (!savedWallet || savedWallet === '0xUNKNOWN');

	const sealIntegrity = Math.max(0, 100 - ((totalMarksFed / targetMarks) * 100));

	useEffect(() => {
		// Individual seal logic - no global fetch needed
	}, []);

	return (
		<div className="seal-engine-page" style={{ 
			minHeight: '100vh', 
			backgroundColor: '#050505',
			overflow: 'hidden',
			position: 'relative',
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center',
			fontFamily: '"Space Mono", monospace',
			color: '#e0e0e0'
		}}>
			{/* Ambient Darkness Background */}
			<div className="engine-ambient-bg" style={{
				position: 'absolute',
				inset: 0,
				background: `radial-gradient(circle at 50% 50%, rgba(138, 3, 3, ${0.1 + (100 - sealIntegrity)*0.002}) 0%, transparent 70%)`,
				opacity: machineState === 'feeding' ? 1 : 0.6,
				transition: 'opacity 2s ease, background 5s ease',
				zIndex: 0
			}} />

			<div className="engine-noise-overlay" />

			<header className="engine-nav" style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '2rem', zIndex: 10, display: 'flex', justifyContent: 'space-between' }}>
				<a href="/" style={{ color: '#555', textDecoration: 'none', letterSpacing: '0.2em', fontSize: '0.8rem', transition: 'color 0.3s' }}
				   onMouseEnter={e => e.target.style.color = '#ff4d4d'}
				   onMouseLeave={e => e.target.style.color = '#555'}
				>
					← DEPART
				</a>
				<div style={{ color: '#ff4d4d', letterSpacing: '0.4em', fontSize: '0.7rem', opacity: 0.5 }}>
					THE SEAL ENGINE
				</div>
			</header>

			<main className="engine-main" style={{ 
				position: 'relative', 
				zIndex: 5, 
				width: '100%', 
				height: '100vh',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center'
			}}>
				<HoodPlacement spotId="engine-1" index={3} style={{ position: 'absolute', top: '20%', left: '15%' }} />
				<HoodPlacement spotId="engine-2" index={4} style={{ position: 'absolute', top: '15%', right: '20%' }} />
				<HoodPlacement spotId="engine-3" index={5} style={{ position: 'absolute', bottom: '25%', right: '15%' }} />
				<HoodPlacement spotId="engine-4" index={6} style={{ position: 'absolute', bottom: '20%', left: '25%' }} />
				
				<SealMachine />
			</main>

			{/* UI overlays that sit on top/around the machine */}
			<div style={{ position: 'absolute', top: '6rem', left: '2rem', zIndex: 10 }}>
				<EngineControls />
			</div>

			{/* Full Screen Sequences */}
			{machineState === 'dispensing' && <DispenseSequence />}

			{/* 0% Takeover Sequence */}
			{isBroken && !dismissTakeover && (
				<div style={{
					position: 'absolute',
					inset: 0,
					zIndex: 999,
					background: '#030000',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					textAlign: 'center'
				}}>
					<div style={{ color: '#ff4d4d', letterSpacing: '0.5em', fontSize: '1rem', marginBottom: '1rem', animation: 'pulse 2s infinite' }}>
						CONTAINMENT FAILURE
					</div>
					<h1 style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', color: '#fff', margin: 0, textShadow: '0 0 30px #ff0000', letterSpacing: '-2px' }}>
						THE DARKNESS HAS TAKEN OVER.
					</h1>
					{needsResecure ? (
						<div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', background: 'rgba(255,0,0,0.1)', padding: '2rem', border: '1px solid #ff4d4d', borderRadius: '4px' }}>
							<div style={{ color: '#ff4d4d', fontSize: '1.2rem', fontWeight: 'bold' }}>ANOMALY DETECTED</div>
							<p style={{ color: '#fff', fontSize: '0.9rem', maxWidth: '400px' }}>
								Your Seal Engine is broken, but your wallet data was lost in the void before reaching the Sanctum. Re-secure your details immediately to finalize your raffle entry.
							</p>
							<input 
								type="text" 
								placeholder="@twitterhandle" 
								value={resecureTwitter} 
								onChange={e => setResecureTwitter(e.target.value)} 
								style={{ background: '#111', border: '1px solid #555', color: '#fff', padding: '0.8rem', width: '300px', textAlign: 'center' }} 
							/>
							<input 
								type="text" 
								placeholder="Wallet Address" 
								value={resecureWallet} 
								onChange={e => setResecureWallet(e.target.value)} 
								style={{ background: '#111', border: '1px solid #555', color: '#fff', padding: '0.8rem', width: '300px', textAlign: 'center' }} 
							/>
							<button 
								disabled={!resecureTwitter || !resecureWallet}
								onClick={async () => {
									const res = await resecureDetails(resecureWallet, resecureTwitter);
									if (res.success) {
										alert('Details re-secured successfully. You are in the raffle.');
									}
								}}
								style={{ background: '#ff4d4d', border: 'none', color: '#000', padding: '0.8rem 2rem', cursor: (!resecureTwitter || !resecureWallet) ? 'not-allowed' : 'pointer', fontWeight: 'bold', marginTop: '1rem' }}
							>
								RE-SECURE ENTRY
							</button>
						</div>
					) : (
						<>
							<p style={{ color: '#aaa', marginTop: '2rem', fontSize: '1.2rem', letterSpacing: '2px', fontFamily: '"Space Mono", monospace' }}>
								The Seal has been broken by 4,444 Marks.<br/>
								You have entered the final raffle for 500 Guaranteed Spots.
							</p>
							<button onClick={() => setDismissTakeover(true)} style={{
								marginTop: '3rem',
								color: '#ff4d4d',
								background: 'transparent',
								cursor: 'pointer',
								letterSpacing: '0.2em',
								fontSize: '0.9rem',
								border: '1px solid #ff4d4d',
								padding: '0.8rem 1.5rem',
								transition: 'all 0.3s ease'
							}}
							onMouseEnter={e => {
								e.target.style.background = 'rgba(255,77,77,0.1)';
							}}
							onMouseLeave={e => {
								e.target.style.background = 'transparent';
							}}>
								← RETURN
							</button>
						</>
					)}
					<style>{`@keyframes pulse { 0%,100%{opacity:0.5} 50%{opacity:1} }`}</style>
				</div>
			)}
		</div>
	);
}
