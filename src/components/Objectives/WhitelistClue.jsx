import { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import DetectionZone from '../DetectionZone';
import useInterface from '../../hooks/useInterface';
import useGame from '../../hooks/useGame';
import useGameplaySettings from '../../hooks/useGameplaySettings';
import useWhitelist from '../../hooks/useWhitelist';
import '../Interface/Whitelist/WhitelistClaimPanel.css';

const CORRIDORLENGTH = 5.95;
// Offset roughly mirrors other wall-mounted objective props (e.g. Bedsheets),
// placed on the room's back wall.
const offset = [8.6, 1.35, 6.35];

/**
 * A painted-over wall panel hidden inside the player's current room. Players
 * scratch the paint off (same "hold to interact" mechanic as cleaning
 * objectives) to reveal today's whitelist code, then can open the claim
 * panel from the HUD.
 */
export default function WhitelistClue() {
	const setCursor = useInterface((state) => state.setCursor);
	const [isDetected, setIsDetected] = useState(false);
	const codeRevealed = useWhitelist((state) => state.codeRevealed);
	const revealCode = useWhitelist((state) => state.revealCode);
	const campaign = useWhitelist((state) => state.campaign);
	const progressConditionsRef = useRef(null);
	const playerPositionRoom = useGame((state) => state.playerPositionRoom);
	const roomCount = useGameplaySettings((state) => state.roomCount);
	const { camera } = useThree();
	const characterTexture = useTexture(
		'/images/haunting-hoods-main-character.png'
	);

	const position = useMemo(() => {
		const roomNumber = playerPositionRoom || 0;
		if (roomNumber >= roomCount / 2) {
			return [
				offset[0] -
					CORRIDORLENGTH -
					(roomNumber - roomCount / 2) * CORRIDORLENGTH,
				offset[1],
				-offset[2],
			];
		}
		return [
			-(offset[0] - 5.91) - roomNumber * CORRIDORLENGTH,
			offset[1],
			offset[2],
		];
	}, [playerPositionRoom, roomCount]);

	const rotation = useMemo(
		() => [0, position[2] < 0 ? Math.PI : 0, 0],
		[position]
	);

	useEffect(() => {
		const handleProgressComplete = () => {
			const savedConditions = progressConditionsRef.current;
			const currentCursor = useInterface.getState().cursor;

			if (
				savedConditions &&
				currentCursor === 'clean-whitelist-clue' &&
				!codeRevealed
			) {
				revealCode();
				setCursor(null);
				setIsDetected(false);
			}
			progressConditionsRef.current = null;
		};

		document.addEventListener('progressComplete', handleProgressComplete);
		return () => {
			document.removeEventListener(
				'progressComplete',
				handleProgressComplete
			);
		};
	}, [codeRevealed, revealCode, setCursor]);

	const handleDetection = useCallback(() => {
		if (codeRevealed) return;
		setCursor('clean-whitelist-clue');
		setIsDetected(true);
		progressConditionsRef.current = { isDetected: true };
	}, [setCursor, codeRevealed]);

	const handleDetectionEnd = useCallback(() => {
		setCursor(null);
		setIsDetected(false);
	}, [setCursor]);

	if (!campaign || campaign.active === false) return null;

	return (
		<group position={position} rotation={rotation}>
			<DetectionZone
				position={[0, 0, 0.1]}
				scale={1.2}
				distance={2.5}
				onDetect={handleDetection}
				onDetectEnd={handleDetectionEnd}
				type="clean"
				name="whitelist-clue"
			/>

			{/* Painted-over panel: hides the code until scratched off */}
			<mesh visible={!codeRevealed}>
				<planeGeometry args={[0.9, 0.6]} />
				<meshStandardMaterial color="#3a0d0d" roughness={0.9} />
			</mesh>

			{/* Our hooded character, faintly bleeding through the paint like a framed
			 * portrait, before the code is scratched off */}
			{!codeRevealed && (
				<mesh position={[0, 0, 0.001]} scale={[0.7, 0.85, 1]}>
					<planeGeometry args={[1, 1]} />
					<meshBasicMaterial
						map={characterTexture}
						transparent
						opacity={0.35}
					/>
				</mesh>
			)}

			{/* Revealed code text, rendered once scratched (HUD prompt below shows the actual code + claim button) */}
			{codeRevealed && (
				<mesh position={[0, 0, -0.001]}>
					<planeGeometry args={[0.9, 0.6]} />
					<meshStandardMaterial color="#111" roughness={0.9} />
				</mesh>
			)}

			{/* Our hooded character, as if peering out from behind the wall once the code is found */}
			{codeRevealed && (
				<mesh position={[0.22, -0.02, -0.002]} scale={[0.42, 0.55, 1]}>
					<planeGeometry args={[1, 1]} />
					<meshBasicMaterial
						map={characterTexture}
						transparent
						opacity={0.85}
					/>
				</mesh>
			)}
		</group>
	);
}

/**
 * Lightweight HUD overlay shown once the code has been revealed, with a
 * button to open the claim panel. Kept as a DOM overlay (not drei/Html on
 * the mesh) to guarantee legibility and consistent styling with the rest
 * of the interface.
 */
export function WhitelistCluePrompt() {
	const codeRevealed = useWhitelist((state) => state.codeRevealed);
	const campaign = useWhitelist((state) => state.campaign);
	const alreadyClaimed = useWhitelist((state) => state.alreadyClaimed);
	const openClaimPanel = useWhitelist((state) => state.openClaimPanel);

	if (!codeRevealed || alreadyClaimed) return null;

	return (
		<div className="whitelist-clue-prompt">
			<p>You scratched away the paint and found a code on the wall.</p>
			<code>{campaign?.code}</code>
			<button onClick={() => openClaimPanel(true)}>Claim Whitelist Spot</button>
		</div>
	);
}
