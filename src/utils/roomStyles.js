export const roomStyles = [
	{ id: 0, theme: "Normal", wallColor: "#ffffff", floorColor: "#ffffff", woodColor: "#ffffff" },
	{ id: 1, theme: "Bloody", wallColor: "#ff9999", floorColor: "#cc0000", woodColor: "#550000" },
	{ id: 2, theme: "Moldy Green", wallColor: "#a3c2a3", floorColor: "#4d664d", woodColor: "#293329" },
	{ id: 3, theme: "Pitch Dark", wallColor: "#404040", floorColor: "#202020", woodColor: "#111111" },
	{ id: 4, theme: "Rusty Orange", wallColor: "#d98c53", floorColor: "#994d00", woodColor: "#663300" },
	{ id: 5, theme: "Deep Purple", wallColor: "#b399ff", floorColor: "#5900b3", woodColor: "#26004d" },
	{ id: 6, theme: "Toxic Yellow", wallColor: "#ffff99", floorColor: "#cccc00", woodColor: "#666600" },
	{ id: 7, theme: "Freezing Blue", wallColor: "#cceeff", floorColor: "#0088cc", woodColor: "#003366" },
	{ id: 8, theme: "Charred Black", wallColor: "#333333", floorColor: "#1a1a1a", woodColor: "#000000" },
	{ id: 9, theme: "Sickly Yellow", wallColor: "#e6e6b3", floorColor: "#b3b300", woodColor: "#4d4d00" },
	{ id: 10, theme: "Crimson Red", wallColor: "#ff4d4d", floorColor: "#990000", woodColor: "#4d0000" },
	{ id: 11, theme: "Ghostly Pale", wallColor: "#f2f2f2", floorColor: "#e6e6e6", woodColor: "#cccccc" },
	{ id: 12, theme: "Swampy Brown", wallColor: "#bf8040", floorColor: "#664020", woodColor: "#331a00" },
	{ id: 13, theme: "Neon Pink", wallColor: "#ffb3e6", floorColor: "#ff00aa", woodColor: "#800055" },
	{ id: 14, theme: "Ashen Gray", wallColor: "#b3b3b3", floorColor: "#737373", woodColor: "#404040" },
	{ id: 15, theme: "Void", wallColor: "#1a1a1a", floorColor: "#000000", woodColor: "#0a0a0a" },
];

export const getRoomStyle = (roomIndex) => {
	const index = parseInt(roomIndex, 10);
	if (isNaN(index) || index < 0 || index >= roomStyles.length) {
		return roomStyles[0];
	}
	return roomStyles[index] || roomStyles[0];
};
