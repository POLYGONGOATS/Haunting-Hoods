import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import useSigils from '../../../hooks/useSigils';

const ALL_SIGILS = [
	{ id: 1, symbol: '☽' },
	{ id: 2, symbol: '✦' },
	{ id: 3, symbol: '⛧' },
	{ id: 4, symbol: '◈' },
	{ id: 5, symbol: '🜂' },
	{ id: 6, symbol: '🜄' },
];

export default function ArchivePanel() {
	const { collectedSigils, initCheck } = useSigils();

	useEffect(() => {
		initCheck();
	}, [initCheck]);

	if (collectedSigils.length === 0) return null;

	const isWhitelistRoute = window.location.pathname.startsWith('/whitelist');
	if (collectedSigils.length === 6 && !isWhitelistRoute) return null;

	return (
		<motion.div 
			drag
			dragConstraints={{ left: 0, right: window.innerWidth - 300, top: 0, bottom: window.innerHeight - 300 }}
			dragElastic={0.1}
			dragMomentum={false}
			style={{
				position: 'fixed',
				bottom: '2rem',
				left: '2rem',
				background: 'rgba(5, 5, 5, 0.95)',
				border: '1px solid #333',
				padding: '1.5rem',
				zIndex: 100,
				fontFamily: '"Space Mono", monospace',
				color: '#ccc',
				minWidth: '200px',
				boxShadow: '0 0 20px rgba(0,0,0,0.8)',
				pointerEvents: 'auto',
				cursor: 'grab',
			}}
			whileTap={{ cursor: 'grabbing' }}
		>
			<h4 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: '#fff', letterSpacing: '2px', borderBottom: '1px solid #333', paddingBottom: '0.5rem', pointerEvents: 'none' }}>THE ARCHIVE</h4>
			<div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
				{ALL_SIGILS.map((sigil) => {
					const isFound = collectedSigils.includes(sigil.id);
					return (
						<div key={sigil.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: isFound ? 1 : 0.4 }}>
							<span style={{ fontSize: '1.2rem', color: isFound ? '#ff4d4d' : '#555' }}>
								{isFound ? sigil.symbol : '?'}
							</span>
							<span style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>
								{isFound ? 'FOUND' : 'HIDDEN'}
							</span>
						</div>
					);
				})}
			</div>
			{collectedSigils.length === 6 && (
				<div style={{ marginTop: '1rem', paddingTop: '0.5rem', borderTop: '1px solid #333', color: '#ff4d4d', fontSize: '0.8rem', textAlign: 'center' }}>
					THE SEAL IS BROKEN
				</div>
			)}
		</motion.div>
	);
}
