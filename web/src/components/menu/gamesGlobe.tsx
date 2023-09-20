/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Globe, { GlobeMethods } from "react-globe.gl";

const ARC_REL_LEN = 0.4; // relative to whole arc
const FLIGHT_TIME = 1000;
const NUM_RINGS = 3;
const RINGS_MAX_R = 5; // deg
const RING_PROPAGATION_SPEED = 5; // deg/sec

const GamesGlobe = () => {
	const [arcsData, setArcsData] = useState([]);
	const [ringsData, setRingsData] = useState([]);
	const [windowHeight, setWindowHeight] = useState(window.innerHeight);
	const globeEl = useRef<GlobeMethods>();

	function handleResize() {
		setWindowHeight(window.innerHeight);
	}

	window.addEventListener("resize", handleResize);

	useEffect(() => {
		const globe = globeEl.current;
		if (!globe) return;
		globe.controls().autoRotate = true;
		globe.controls().autoRotateSpeed = 0.2;
		globe.pointOfView({ lat: 39.6, lng: -98.5, altitude: 1.7 }); // USA
	}, [globeEl]);

	const prevCoords = useRef({ lat: 0, lng: 0 });
	// @ts-ignore
	const emitArc = useCallback(({ lat: endLat, lng: endLng }) => {
		const { lat: startLat, lng: startLng } = prevCoords.current;
		prevCoords.current = { lat: endLat, lng: endLng };

		// add and remove arc after 1 cycle
		const arc = { startLat, startLng, endLat, endLng };
		// @ts-ignore
		setArcsData((curArcsData) => [...curArcsData, arc]);
		/* setTimeout(
			() =>
				setArcsData((curArcsData) =>
					curArcsData.filter((d) => d !== arc),
				),
			FLIGHT_TIME * 2,
		); */

		// add and remove start rings
		const srcRing = { lat: startLat, lng: startLng };
		// @ts-ignore
		setRingsData((curRingsData) => [...curRingsData, srcRing]);
		setTimeout(
			() =>
				setRingsData((curRingsData) =>
					curRingsData.filter((r) => r !== srcRing),
				),
			FLIGHT_TIME * ARC_REL_LEN,
		);

		// add and remove target rings
		setTimeout(() => {
			const targetRing = { lat: endLat, lng: endLng };
			// @ts-ignore
			setRingsData((curRingsData) => [...curRingsData, targetRing]);
			setTimeout(
				() =>
					setRingsData((curRingsData) =>
						curRingsData.filter((r) => r !== targetRing),
					),
				FLIGHT_TIME * ARC_REL_LEN,
			);
		}, FLIGHT_TIME);
	}, []);

	return (
		<>
			<Globe
				animateIn={false}
				objectRotation={{ x: 10, y: 10, z: 10 }}
				width={windowHeight}
				height={windowHeight}
				backgroundColor="rgba(0,0,0,0)"
				globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
				onGlobeClick={emitArc}
				arcsData={arcsData}
				arcColor={() => "darkOrange"}
				arcDashLength={ARC_REL_LEN}
				arcDashGap={2}
				arcDashInitialGap={1}
				arcDashAnimateTime={FLIGHT_TIME}
				arcsTransitionDuration={0}
				ringsData={ringsData}
				ringColor={() => (t: number) => `rgba(255,100,50,${1 - t})`}
				ringMaxRadius={RINGS_MAX_R}
				ringPropagationSpeed={RING_PROPAGATION_SPEED}
				ringRepeatPeriod={(FLIGHT_TIME * ARC_REL_LEN) / NUM_RINGS}
				ref={globeEl}
			/>
		</>
	);
};

export default GamesGlobe;
