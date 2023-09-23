import { Color as ChessColor } from "chess.js";

export interface TimeRemaining {
	w: number;
	b: number;
}

export type StatusOutcome = {
	status: "waiting" | "inprogress" | "ended";
	outcome: "w" | "b" | "d" | null;
};

export type ExitReason = "NotFound" | "Forbidden";

export type WSMessage =
	| { t: "started"; f: string; d: ChessColor }
	| { t: "move"; d: string }
	| { t: "moved"; d: { f: string; m: string; t: TimeRemaining } }
	| { t: "gameover"; d: StatusOutcome }
	| {
			t: "info";
			f: string;
			d: {
				w: string;
				b: string;
				h: string[];
				t: number;
				i: number;
				s: StatusOutcome;
			};
	  }
	| { t: "player"; d: ChessColor }
	| {
			t: "gamefull";
			f: string;
			d: {
				w: string;
				b: string; // TODO: some more detailed player identity
				h: string[];
			};
	  }
	| { t: "resign"; d: StatusOutcome }
	| { t: "e"; d: string }
	| { t: "sync"; d: TimeRemaining }
	| { t: "ready" }
	| { t: "exit"; d: ExitReason };
