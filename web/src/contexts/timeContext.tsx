import { TimeRemaining } from "@/model/wsTypes";
import { Dispatch, createContext, useReducer } from "react";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const TimeContext = createContext<TimeState>(null);
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const TimeDispatchContext = createContext<Dispatch<TimeAction>>(null);

interface TimeState {
	startTime: number;
	lastMoveTime: number[];
	time: number[];
	inc: number[];
}
type TimeAction =
	| { type: "start"; payload: null }
	| { type: "move"; payload: "w" | "b" }
	| { type: "update"; payload: number[] }
	| { type: "set"; payload: { side: "w" | "b"; time: TimeRemaining } }
	| { type: "tick"; payload: "w" | "b" };

export const TimeProvider = ({
	startTime,
	increment,
	children,
}: {
	playingSide: "w" | "b";
	startTime: number;
	increment: number;
	children: React.ReactNode;
}) => {
	const [time, dispatch] = useReducer(timeReducer, {
		startTime: 0,
		lastMoveTime: [0, 0],
		time: [startTime, startTime],
		inc: [increment, increment],
	});

	return (
		<TimeContext.Provider value={time}>
			<TimeDispatchContext.Provider value={dispatch}>
				{children}
			</TimeDispatchContext.Provider>
		</TimeContext.Provider>
	);
};

function timeReducer(state: TimeState, action: TimeAction): TimeState {
	const now = Date.now();
	switch (action.type) {
		case "start": {
			return {
				...state,
				startTime: now,
				lastMoveTime: [now, now],
			};
		}
		case "update": {
			return {
				...state,
				time: state.time.map((t, i) => t - action.payload[i]),
			};
		}
		case "tick": {
			return {
				...state,
				time: state.time.map((t, i) =>
					i === (action.payload == "w" ? 0 : 1) ? t - 1000 : t,
				),
			};
		}
		case "set": {
			return {
				...state,
				time: [action.payload.time.w, action.payload.time.b], // TODO: change data strucutre
			};
		}
		case "move": {
			const sideIndex = action.payload == "w" ? 0 : 1;
			const { time, lastMoveTime, inc } = state;
			const delta = now - lastMoveTime[sideIndex];
			return {
				...state,
				time: time.map((t, i) =>
					i === sideIndex ? t - delta + inc[i] : t,
				),
				lastMoveTime: lastMoveTime.map((t, i) =>
					i === sideIndex ? now : t,
				),
			};
		}
		default:
			throw new Error("Invalid action");
	}
}
