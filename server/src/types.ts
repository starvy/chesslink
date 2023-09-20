import {WebSocket} from "uWebSockets.js";
import {Color as ChessColor} from "chess.js";

export interface TimeRemaining {
    w: number;
    b: number;
}

export type StatusOutcome = {
	status: "waiting" | "inprogress" | "ended";
	outcome: "w" | "b" | "d" | null;
}

export type WSMessage = { t: "started"; f: string; d: ChessColor } | 
    { t: "move"; d: string; } |
    { t: "moved"; d: { f: string; m: string; t: TimeRemaining }; } |
    { t: "gameover"; d: StatusOutcome } | 
    { t: "info"; f: string; d: {
        w: string;
        b: string;
        h: string[];
        t: number;
        i: number;
        s: StatusOutcome;
    }} |
    { t: "player", d: ChessColor; } |
    { t: "gamefull"; f: string; d: {
        w: string;
        b: string;
        h: string[];
    }; } | 
    { t: "resign"; d: StatusOutcome; } | 
    { t: "e"; d: string; } | 
    { t: "sync"; d: TimeRemaining;} | 
    { t: "ready"; };


export type TimeControl = `${number}|${number}`;

export interface Client {
    username: string;
    gameId: string;
    color: ChessColor; // TODO: remove?
    session: string;
    time: TimeControl;
}


export type GameClient = WebSocket<Client>;

export type WaitClient = WebSocket<{ gameId: string; session: string; }>;

export interface Player {
    color: ChessColor;
    creator: boolean;
    ready: boolean;
    session: string;
    username: string;
    history: {
        at: number; // TODO: use date instead?
        move: string;
        took: number;
    }[];
}