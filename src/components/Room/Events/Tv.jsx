import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import useGame from '../../../hooks/useGame';
import useInterface from '../../../hooks/useInterface';
import useGamepadControls from '../../../hooks/useGamepadControls';
import DetectionZone from '../../DetectionZone';
import { Text } from '@react-three/drei';
import usePositionalSound from '../../../hooks/usePositionalSound';
import useLight from '../../../hooks/useLight';
import VolumeAwarePositionalAudio from '../../VolumeAwarePositionalAudio';
import * as THREE from 'three';

export default function Tv() {
	const meshRef = useRef();
	const [isDetected, setIsDetected] = useState(false);
	const tv = useGame((state) => state.tv);
	const setTv = useGame((state) => state.setTv);
	const isMobile = useGame((state) => state.isMobile);
	const setCursor = useInterface((state) => state.setCursor);
	const cursor = useInterface((state) => state.cursor);
	const tvSoundRef = useRef();
	const playerPositionRoom = useGame((state) => state.playerPositionRoom);
	const activeTvs = useGame((state) => state.activeTvs);
	const setActiveTv = useGame((state) => state.setActiveTvs);
	const whiteNoiseSound = usePositionalSound('whiteNoise');
	const mobileClick = useGame((state) => state.mobileClick);
	const setMobileClick = useGame((state) => state.setMobileClick);
	const gamepadControls = useGamepadControls();
	const prevXButtonRef = useRef(false);
	const activeRaids = useGame((state) => state.activeRaids);
	const [showHide, setShowHide] = useState(false);
	const knockedRooms = useGame((state) => state.knockedRooms);
	const setTvLight = useLight((state) => state.setTvLight);

	const characterTexture = useTexture(
		'/images/haunting-hoods-main-character.png'
	);

	const uniforms = useMemo(
		() => ({
			uTime: { value: 0 },
			uCharacter: { value: characterTexture },
			uOn: { value: false },
		}),
		[characterTexture]
	);

	const redTextMaterial = useMemo(() => {
		return new THREE.MeshBasicMaterial({ color: '#000' });
	}, []);

	const tvOnAtRef = useRef(0);

	useFrame((state) => {
		const { clock } = state;
		if (meshRef.current) {
			// Time since the TV was switched on (not global elapsed time), so the
			// character reveal always starts predictably shortly after power-on.
			meshRef.current.material.uniforms.uTime.value =
				clock.getElapsedTime() - tvOnAtRef.current;
			meshRef.current.material.uniforms.uOn.value = tv;
		}
		if (tv && tvOnAtRef.current === 0) {
			tvOnAtRef.current = clock.getElapsedTime();
		}
	});

	useEffect(() => {
		if (tv) {
			tvSoundRef.current.play();
			setTvLight('#ffffff', 0.2);
		} else {
			tvSoundRef.current.pause();
			setTvLight('#ffffff', 0);
			tvOnAtRef.current = 0;
		}
	}, [tv, setTvLight]);

	useEffect(() => {
		setTv(activeTvs.includes(playerPositionRoom));
	}, [playerPositionRoom, activeTvs, setTv]);

	useEffect(() => {
		if (tv && activeRaids.includes(playerPositionRoom)) {
			setShowHide(true);
		} else {
			setShowHide(false);
		}
	}, [tv, activeRaids, playerPositionRoom]);

	useFrame(() => {
		const xButtonPressed = gamepadControls().action;
		if (
			isDetected &&
			xButtonPressed &&
			!prevXButtonRef.current &&
			cursor === 'power-tv'
		) {
			setTv(!tv);
			setActiveTv(playerPositionRoom);
		}
		prevXButtonRef.current = xButtonPressed;
	});

	useEffect(() => {
		if (isDetected && mobileClick && cursor === 'power-tv') {
			setTv(!tv);
			setActiveTv(playerPositionRoom);
			setMobileClick(false);
		}
	}, [
		isDetected,
		mobileClick,
		playerPositionRoom,
		setActiveTv,
		setMobileClick,
		setTv,
		tv,
		knockedRooms,
		cursor,
	]);

	useEffect(() => {
		const handleMouseDown = (e) => {
			if (e.button === 0 && cursor === 'power-tv' && !isMobile && isDetected) {
				setTv(!tv);
				setActiveTv(playerPositionRoom);
			}
		};

		window.addEventListener('mousedown', handleMouseDown);

		return () => {
			window.removeEventListener('mousedown', handleMouseDown);
		};
	}, [cursor, isDetected, tv, setTv, setActiveTv, playerPositionRoom]);

	return (
		<group position={[-1.285, 0.9, 3.65]}>
			<DetectionZone
				position={[0.1, 0, -0.1]}
				scale={[0.2, 1, 1.5]}
				onDetect={() => {
					setCursor('power-tv');
					setIsDetected(true);
				}}
				onDetectEnd={() => {
					setCursor(null);
					setIsDetected(false);
				}}
				downward={true}
				name="tv"
				type="power"
			/>
			<mesh
				visible={true}
				scale={0.087}
				rotation={[0, Math.PI / 2, 0]}
				ref={meshRef}
			>
				<planeGeometry args={[16, 9]} />
				<shaderMaterial
					uniforms={uniforms}
					vertexShader={`
					varying vec2 vUv;
					void main() {
						vUv = uv;
						gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
					}
				`}
					fragmentShader={`
					uniform float uTime;
					uniform sampler2D uCharacter;
					uniform bool uOn;
					varying vec2 vUv;
					
					float random(vec2 st) {
						return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
					}
					
					void main() {
						vec2 st = vUv;
						float noise = random(st + uTime);

						// Fit the (portrait) character image into the (landscape)
						// screen without stretching, centered, cropping sides.
						vec2 charUv = st;
						float screenAspect = 16.0 / 9.0;
						float charAspect = 768.0 / 894.0;
						float scale = charAspect / screenAspect;
						charUv.x = (charUv.x - 0.5) * scale + 0.5;
						vec3 characterColor = texture2D(uCharacter, charUv).rgb;
						bool inBounds = charUv.x >= 0.0 && charUv.x <= 1.0;

						if (!uOn) {
							gl_FragColor = vec4(0.05, 0.01, 0.01, 1.0);
							return;
						}

						// He appears in the static a few seconds after power-on, and
						// keeps reappearing every ~8 seconds as if watching.
						float cycle = mod(uTime, 8.0);
						float presence = smoothstep(1.5, 2.2, cycle) * (1.0 - smoothstep(5.0, 5.8, cycle));

						vec3 staticColor = vec3(noise);
						vec3 finalColor = inBounds
							? mix(staticColor, characterColor, presence)
							: staticColor;

						gl_FragColor = vec4(finalColor, 1.0);
					}
				`}
				/>
			</mesh>

			{showHide && (
				<group scale={0.1} position={[0.01, 0, 0]}>
					<Text
						font={'/Redrum.otf'}
						rotation={[0, Math.PI / 2, 0]}
						material={redTextMaterial}
						scale={2}
					>
						HIDE
					</Text>
				</group>
			)}
			<VolumeAwarePositionalAudio
				ref={tvSoundRef}
				{...whiteNoiseSound}
				distance={0.6}
				loop={true}
			/>
		</group>
	);
}
