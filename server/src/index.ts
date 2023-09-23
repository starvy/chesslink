import {HttpRequest, HttpResponse, TemplatedApp, WebSocket} from "uWebSockets.js";
import { Player, WSMessage, Client, WaitClient, ExitReason } from "./types";

import uWS from 'uWebSockets.js';
import { Game, GameBuilder, Params } from "./game";
import { playerTimeRemaining, sendToEach } from "./utils";
const app: TemplatedApp = uWS.App();

const games = new Map<string, Game>();
const builders = new Map<string, GameBuilder>();

app.ws('/w', {
    upgrade: (res: HttpResponse, req: HttpRequest, context: any) => {
        const gameId = req.getQuery("game");
        const session = req.getQuery("session");

        if (!gameId || !session) {
            res.close();
            return;
        }
        res.upgrade({
                gameId,
                session
            } as Client,
            req.getHeader("sec-websocket-key"),
            req.getHeader("sec-websocket-protocol"),
            req.getHeader("sec-websocket-extensions"),
            context
        );
    },
    open: (ws: WaitClient) => {
        const data = ws.getUserData();
        if (games.has(data.gameId)) {
            const game = games.get(data.gameId)!;
            send(ws,{
                t: "gamefull",
                f: game.chess.fen(),
                d: {
                    w: game.players[0].username,
                    b: game.players[1].username,
                    h: game.history()
                }
            });
        }
        const builder = builders.get(data.gameId) ?? newBuilder(data.gameId, data.session);
        builder.clients.push(ws);
        console.log(builders);
    },
    message: (ws: WaitClient, buf: ArrayBuffer, isBinary: boolean) => {
        try {
            const msg = JSON.parse(Buffer.from(buf).toString()) as { t: "params", d: Params };
            const data = ws.getUserData();

            if (msg.t !== "params") return;

            const builder = builders.get(data.gameId)!;
            builder.setParams(msg.d);

            builder.clients.forEach(client => {
                client.send(JSON.stringify({
                    t: "params",
                    d: msg.d
                }));
            });

            // TODO: only one client

        } catch (e) {
            console.error(e);
        }
    },
    close: (ws: WaitClient, code: number, message: ArrayBuffer) => {
        const data = ws.getUserData();
        const builder = builders.get(data.gameId);
        if (!builder) return;
        builder.clients = builder.clients.filter(clientWs => clientWs !== ws);
        if (builder.clients.length === 0) {
            builders.delete(builder.id);
        }
    }
})

app.ws('/p', {
    upgrade: (res: HttpResponse, req: HttpRequest, context: any) => {
        const username = req.getQuery("name");
        const gameId = req.getQuery("game");
        const color = req.getQuery("color");
        const session = req.getQuery("session");
        const time = req.getQuery("time");
        
        console.log("upgrading p client", username);
        if (!username || !gameId || !session) {
            res.writeStatus("400 Bad Request").end();
            return;
        }
        res.upgrade({
                username,
                gameId,
                color,
                session,
                time
            } as Client,
            req.getHeader("sec-websocket-key"),
            req.getHeader("sec-websocket-protocol"),
            req.getHeader("sec-websocket-extensions"),
            context
        );
    },
    open: (ws: WebSocket<Client>) => {
        console.log("opening p client");
        const data = ws.getUserData();

        const builder = builders.get(data.gameId);
        console.log(builders);
        if (!builder && !games.has(data.gameId)) {
            exit(ws, "NotFound");
            return;
        }

        const player: Player = {
            color: data.color,
            session: data.session,
            username: data.username,
            creator: false,
            ready: false,
            history: []
        };
        // create game if it doesn't exist, otherwise join the game
        const game = games.get(data.gameId) ?? newGame(builder!, player);

        game.clients.push(ws);
        
        const matchingPlayer = game.players.find(p => p.session === data.session);
        if (!matchingPlayer) {
            exit(ws, "Forbidden");
            return;
        }
        matchingPlayer.username = data.username;

        ws.send(JSON.stringify({
            t: "player",
            d: matchingPlayer.color
        } as WSMessage));

        const playerWhite = game.players[0];
        const playerBlack = game.players[1];
        console.log(game.id, playerWhite, playerBlack);

        game.clients.forEach(
            (ws) => ws.send(JSON.stringify({
                t: "info",
                f: game.chess.fen(),
                d: {
                    h: game.history(),
                    w: playerWhite?.username,
                    b: playerBlack?.username,
                    t: game.totalTimeMs,
                    i: game.incrementMs,
                    s: game.statusOutcome(),
                }
        } as WSMessage)));

        if (builder && playerWhite && playerBlack) {
            sendToEach(builder.clients, {
                t: "gamefull",
                f: game.chess.fen(),
                d: {
                    w: playerWhite.username,
                    b: playerBlack.username,
                    h: game.history()
                }
            });
        }

    },
    message: (ws: WebSocket<Client>, buf: ArrayBuffer) => {
        try {
            const msg = JSON.parse(Buffer.from(buf).toString()) as WSMessage;

            const client = ws.getUserData();
            const game = games.get(client?.gameId)!;
            const player = game?.players.find(p => p.session === client?.session)!;
            const opponent = game?.players.find(p => p.session !== client?.session)!;

            if (msg.t === "ready") {
                player.ready = true;
                if (game.isReady()) {
                    console.log(game.id, "starting");
                    game.start();
                }
            }

            if (!game.started) { // game hasn't started, TODO: time control
                ws.send(JSON.stringify({
                    t: "e",
                    d: game?.chess.fen()
                }));
                return;
            }

            switch (msg.t) {
                // performs the move if possible and sends the new fen to all players
                case "move":
                    const move = msg.d;
                    const isSideToMove = player.color === game.chess.turn();
                    if (!isSideToMove) {
                        ws.send(JSON.stringify({ // TODO: return something like "not your turn"
                            t: "e",
                            d: game.chess.fen()
                        }));
                        break;
                    }
                    console.log(game.id, move);
                    game.chess.move(move); // TODO: extract function from this

                    const now = Date.now();
                    player.history.push({
                        move,
                        took: opponent.history.length > 0 ? now - opponent.history[opponent.history.length - 1].at : 0,
                        at: now
                    });
                    
                    const wRemaining = playerTimeRemaining(game.players[0], game.totalTimeMs, game.incrementMs);
                    const bReamining = playerTimeRemaining(game.players[1], game.totalTimeMs, game.incrementMs);

                    sendToEach(game.clients, {
                        t: "moved",
                        d: {f: game.chess.fen(), t: { w: wRemaining, b: bReamining }, m: move}
                    });

                    if (!game.chess.isGameOver()) {
                        break;
                    }

                    // @ts-ignore
                    clearInterval(game.timer!);
                    game.timer = null;
                    sendToEach(game.clients, {
                        t: "gameover",
                        d: game.statusOutcome()
                    });
                    break;
                case "resign":
                    sendToEach(game.clients, {
                        t: "gameover",
                        d: {
                            status: "ended",
                            outcome: client.color === "w" ? "b" : "w"
                        }
                    });
                    break;
            }
        } catch (e) {
            console.error(e);
        }
    },
    close: (ws: WebSocket<any>, code: number, message: ArrayBuffer) => {
        const game = games.get(ws.getUserData().gameId);
        if (!game) return;
        game.clients = game.clients.filter(clientWs => clientWs !== ws);
        if (game.clients.length === 0) {
            games.delete(game.id);
        }
    }
}).listen(8080, (listenSocket: any) => {
    if (listenSocket) {
        console.log('Listening to port 8080');
    }
});



const newGame = (builder: GameBuilder, player: Player) => {
    const game = Game.fromBuilder(builder, player);
    games.set(game.id, game);
    return game;
}

const newBuilder = (gameId: string, session: string) => {
    const builder = new GameBuilder(gameId, session);
    builders.set(gameId, builder);
    return builder;
}

const exit = (ws: WebSocket<any>, reason: ExitReason) => {
    ws.send(JSON.stringify({
        t: "exit",
        d: reason
    }));
    ws.close();
}

const send = (ws: WebSocket<any>, msg: WSMessage) => {
    ws.send(JSON.stringify(msg));
}