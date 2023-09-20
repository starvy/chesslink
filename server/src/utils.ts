import { GameClient, Player, WSMessage, WaitClient } from "./types";

export const sendToEach = (clients: Array<GameClient | WaitClient>, msg: WSMessage) => {
    clients.forEach(client => {
        client.send(JSON.stringify(msg));
    });
};

export const playerTimeRemaining = (player: Player, totalTimeMs: number, incrementMs: number): number => {
    return totalTimeMs -
        player.history.reduce((a, b) => a + b.took, 0) +
        player.history.length * incrementMs;
}