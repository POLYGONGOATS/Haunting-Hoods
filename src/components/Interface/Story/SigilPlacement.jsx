import React from 'react';
import useSigils from '../../../hooks/useSigils';
import Sigil from './Sigil';

const SIGIL_SYMBOLS = {
	1: '☽',
	2: '✦',
	3: '⛧',
	4: '◈',
	5: '🜂',
	6: '🜄',
};

export default function SigilPlacement({ spotId, style }) {
	const spotMapping = useSigils((state) => state.spotMapping);
	const sigilId = spotMapping[spotId];

	if (!sigilId) return null;

	return (
		<Sigil 
			id={sigilId} 
			symbol={SIGIL_SYMBOLS[sigilId]} 
			style={style} 
		/>
	);
}
