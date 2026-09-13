import React, { useState } from 'react';
import useSealEngine from '../../../../hooks/useSealEngine';

export default function EngineControls() {
	const { 
		userMarks, 
		totalMarksFed, 
		targetMarks, 
		feedEngine, 
		machineState,
		hasFoundHoods,
		foundHoods,
		hasDoneTwitter,
		hasSubmittedAddress,
		completeTwitterTask,
		completeAddressTask
	} = useSealEngine();

	const [wallet, setWallet] = useState('');
	const [twitter, setTwitter] = useState('');

	const isBusy = machineState !== 'idle';
	const canFeed = userMarks > 0 && !isBusy;

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '260px', background: 'rgba(5,5,5,0.85)', padding: '1rem', border: '1px solid #333', borderRadius: '4px' }}>
			
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid #333', paddingBottom: '0.75rem' }}>
				<div>
					<div style={{ fontSize: '0.5rem', color: '#555', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>
						GLOBAL MARKS FED
					</div>
					<div style={{ fontSize: '1.4rem', color: '#e0e0e0', letterSpacing: '1px', fontVariantNumeric: 'tabular-nums' }}>
						{totalMarksFed.toLocaleString()} <span style={{fontSize: '0.7rem', color: '#555'}}>/ {targetMarks.toLocaleString()}</span>
					</div>
				</div>
				<div style={{ textAlign: 'right' }}>
					<div style={{ fontSize: '0.5rem', color: '#555', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>
						YOUR MARKS
					</div>
					<div style={{ fontSize: '1.2rem', color: '#ff4d4d', letterSpacing: '1px', fontVariantNumeric: 'tabular-nums' }}>
						{userMarks.toLocaleString()}
					</div>
				</div>
			</div>

			<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
				<div style={{ fontSize: '0.7rem', color: '#aaa', letterSpacing: '0.1em' }}>ACQUIRE MARKS</div>

				{/* Task 1: Spot 4 Hoods */}
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: hasFoundHoods ? 0.5 : 1 }}>
					<div>
						<div style={{ color: '#fff', fontSize: '0.9rem' }}>Spot 4 Hoods</div>
						<div style={{ color: '#ff4d4d', fontSize: '0.7rem' }}>+444 Marks</div>
					</div>
					<div style={{ color: hasFoundHoods ? '#777' : '#ff4d4d', fontSize: '0.9rem', fontFamily: '"Space Mono", monospace' }}>
						{hasFoundHoods ? 'DONE' : `${foundHoods?.length || 0} / 4`}
					</div>
				</div>

				{/* Task 2: Twitter */}
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: hasDoneTwitter ? 0.5 : 1 }}>
					<div>
						<div style={{ color: '#fff', fontSize: '0.9rem' }}>Share Your Mark</div>
						<div style={{ color: '#ff4d4d', fontSize: '0.7rem' }}>+2000 Marks</div>
					</div>
					<button 
						disabled={hasDoneTwitter}
						onClick={() => {
							const text = encodeURIComponent(`I survived the darkness and uncovered 4 sealed entities. Their presence is haunting. The reckoning approaches...\n\n@Haunting_Hoods`);
							window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
							completeTwitterTask();
						}}
						style={{ background: hasDoneTwitter ? '#333' : 'transparent', border: '1px solid #ff4d4d', color: '#ff4d4d', padding: '0.5rem 1rem', cursor: hasDoneTwitter ? 'not-allowed' : 'pointer' }}
					>
						{hasDoneTwitter ? 'DONE' : 'TWEET'}
					</button>
				</div>

				{/* Task 3: Address */}
				<div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', opacity: hasSubmittedAddress ? 0.5 : 1 }}>
					<div style={{ display: 'flex', justifyContent: 'space-between' }}>
						<div style={{ color: '#fff', fontSize: '0.9rem' }}>Submit Details</div>
						<div style={{ color: '#ff4d4d', fontSize: '0.7rem' }}>+2000 Marks</div>
					</div>
					{!hasSubmittedAddress ? (
						<div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
							<input type="text" placeholder="@twitterhandle" value={twitter} onChange={e => setTwitter(e.target.value)} style={{ background: 'transparent', border: '1px solid #555', color: '#fff', padding: '0.5rem' }} />
							<input type="text" placeholder="Wallet Address" value={wallet} onChange={e => setWallet(e.target.value)} style={{ background: 'transparent', border: '1px solid #555', color: '#fff', padding: '0.5rem' }} />
							<button 
								disabled={!twitter || !wallet}
								onClick={() => completeAddressTask(wallet, twitter)}
								style={{ background: '#ff4d4d', border: 'none', color: '#000', padding: '0.5rem', cursor: (!twitter || !wallet) ? 'not-allowed' : 'pointer' }}
							>
								SUBMIT
							</button>
						</div>
					) : (
						<div style={{ color: '#777', fontSize: '0.8rem' }}>Details secured.</div>
					)}
				</div>
			</div>

			{/* Feed Button */}
			<button
				disabled={!canFeed}
				onClick={() => feedEngine()}
				style={{
					background: canFeed ? 'rgba(255, 77, 77, 0.1)' : 'transparent',
					border: `1px solid ${canFeed ? '#ff4d4d' : '#333'}`,
					color: canFeed ? '#ff4d4d' : '#555',
					padding: '1rem',
					fontFamily: '"Space Mono", monospace',
					fontSize: '1rem',
					letterSpacing: '2px',
					cursor: canFeed ? 'pointer' : 'not-allowed',
					transition: 'all 0.3s ease',
				}}
			>
				{isBusy ? 'FEEDING...' : 'FEED THE SEAL'}
			</button>

		</div>
	);
}
