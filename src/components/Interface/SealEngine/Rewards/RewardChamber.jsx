import React from 'react';
import useSealEngine from '../../../../hooks/useSealEngine';

export default function RewardChamber() {
	const { rewards, sealIntegrity } = useSealEngine();

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '300px', textAlign: 'right' }}>
			<div style={{ fontSize: '0.6rem', color: '#555', letterSpacing: '0.2em', borderBottom: '1px solid #222', paddingBottom: '0.5rem' }}>
				DISPENSABLE REWARDS
			</div>

			{rewards.map(reward => {
				const isUnlocked = sealIntegrity <= reward.unlockThreshold;
				const remaining = reward.total - reward.claimed;
				
				// Generate circles for visual scarcity
				// Show max 20 circles to avoid UI clutter, or exact amount if < 20
				const maxDisplay = Math.min(reward.total, 20);
				const ratio = remaining / reward.total;
				const circlesToDisplay = Math.ceil(maxDisplay * ratio);
				const emptyCircles = maxDisplay - circlesToDisplay;

				return (
					<div key={reward.id} style={{ 
						opacity: isUnlocked ? 1 : 0.3,
						transition: 'opacity 0.5s ease',
						display: 'flex',
						flexDirection: 'column',
						gap: '0.5rem'
					}}>
						<div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'baseline', gap: '0.5rem' }}>
							{!isUnlocked && (
								<span style={{ fontSize: '0.6rem', color: '#ff4d4d', letterSpacing: '1px' }}>
									[LOCKED: {reward.unlockThreshold}%]
								</span>
							)}
							<div style={{ color: isUnlocked ? '#e0e0e0' : '#555', letterSpacing: '1px', fontSize: '0.9rem' }}>
								{reward.name}
							</div>
						</div>

						<div style={{ fontSize: '0.7rem', color: '#777' }}>
							Available: {remaining}
						</div>

						{/* Scarcity visualization */}
						<div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px', flexWrap: 'wrap', maxWidth: '200px', alignSelf: 'flex-end' }}>
							{Array.from({ length: circlesToDisplay }).map((_, i) => (
								<span key={`filled-${i}`} style={{ color: isUnlocked ? '#ff4d4d' : '#555', fontSize: '10px' }}>○</span>
							))}
							{Array.from({ length: emptyCircles }).map((_, i) => (
								<span key={`empty-${i}`} style={{ color: '#222', fontSize: '10px' }}>○</span>
							))}
						</div>
					</div>
				);
			})}
		</div>
	);
}
