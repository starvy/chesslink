import { Chess } from "chess.js";
import { Player, GameClient, TimeControl, WaitClient, StatusOutcome } from "./types";
import { playerTimeRemaining, sendToEach } from "./utils";

export interface Params {
    username: string;
    color: "w" | "b";
    time: TimeControl;
}

export class GameBuilder {
    id: string;
    creatorSession: string;
    params: Params = {
        username: "anonymous",
        color: "w",
        time: "120|2"
    }
    clients: WaitClient[] = [];

    constructor(id: string, session: string) {
        this.id = id;
        this.creatorSession = session;
    }

    setParams(params: Params): void {
        this.params = params;
    }
}

export class Game {
    id: string;
    started: boolean = false;
    startedAt: Date = new Date();
    readonly totalTimeMs: number;
    readonly incrementMs: number;
    players: Player[];
    clients: GameClient[];
    chess: Chess;
    timer: NodeJS.Timer | null = null;

    constructor(id: string, players: Player[], clients: GameClient[], chess: Chess, totalTimeMs: number = 120_000, incrementMs: number = 2_000) {
        this.id = id;
        this.players = players;
        this.clients = clients;
        this.chess = chess;
        this.totalTimeMs = totalTimeMs;
        this.incrementMs = incrementMs;
    }


    static fromBuilder(builder: GameBuilder, hostPlayer: { session: string; username: string; }): Game {
        if (!builder.params) throw new Error("GameBuilder must have params");
        const players: Player[] = [
            {
                color: builder.params.color,
                creator: true,
                ready: false,
                session: builder.creatorSession,
                username: builder.params.username,
                history: []
            },
            {
                color: builder.params.color === "w" ? "b" : "w",
                creator: false,
                ready: false,
                session: hostPlayer.session,
                username: hostPlayer.username,
                history: []
            }
        ];
        players.sort((a, b) => a.color === "w" ? -1 : 1);

        const [totalTime, increment] = builder.params.time.split("|").map(n => parseInt(n) * 1000);
        return new Game(builder.id, players, [], new Chess(), totalTime * 60, increment); // TODO: get seconds from frontend instead of minutes
        
    }

    static startpos(id: string, clients: GameClient[], time: TimeControl): Game {
        return new Game(id, [], clients, new Chess());
    }

    statusOutcome(): StatusOutcome {
        if (this.timeRemaining().some(t => t <= 0)) {
            return {
                status: "ended",
                outcome: this.timeRemaining()[0] <= 0 ? "b" : "w"
            }
        }
        if (this.chess.isGameOver()) {
            return {
                status: "ended",
                outcome: this.chess.isCheckmate() ? (this.chess.turn() === "w" ? "b" : "w") : "d"
            }
        }
        if (this.started) {
            return {
                status: "inprogress",
                outcome: null
            }
        }
        return {
            status: "waiting",
            outcome: null
        }
    }


    isReady(): boolean {
        return !this.started && this.players.length === 2 && this.players.every(p => p.ready);
    }

    timeRemaining(): number[] {
        const now = Date.now();
        const sideToMove = this.chess.turn() === "w" ? 0 : 1;
        return this.players.map((p, i) => {
            const lastMoveAt = this.lastMoveAt();
            const remaining = playerTimeRemaining(p, this.totalTimeMs, this.incrementMs);
            const elapsed = lastMoveAt !== 0 && sideToMove === i ? 
                now - lastMoveAt : 0;
            return remaining - elapsed;
        });
    }

    start(): void {
        this.clients.forEach(client => {
            client.send(JSON.stringify({
                t: "started",
                f: this.chess.fen(),
                d: this.players.find(p => p.session === client.getUserData().session)!.color
            }));
        });

        this.started = true;
        this.startedAt = new Date();
        
        this.timer = setInterval(() => {
            const timeRemaining = this.timeRemaining();
    
            if (timeRemaining.some(t => t <= 0)) {
                const winner = timeRemaining[0] <= 0 ? "b" : "w";
                // @ts-ignore
                clearInterval(this.timer!);
                this.timer = null;
                sendToEach(this.clients, {
                    t: "gameover",
                    d: {
                        status: "ended",
                        outcome: winner
                    }
                });
                return;
            }
    
            sendToEach(this.clients, {
                t: "sync",
                d: { w: timeRemaining[0], b: timeRemaining[1] }
            });
        }, 1000);
    }

    lastMoveAt(): number {
        const history = this.players.find(p => p.color === (this.chess.turn() === "w" ? "b" : "w"))?.history;
        if (!history || history.length === 0) return 0;
        return history[history.length - 1].at;
    }

    history(): string[] {
        return this.chess.history({verbose: true}).map(move => move.san);
    }
}