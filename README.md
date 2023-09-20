# Chessl.ink - Multiplayer Chess Game

Chessl.ink is a simple yet engaging online chess game built using Next.js. With Chessl.ink, you can quickly start a game by opening the webpage and sharing the link (4 character code) with a friend. It's a convenient way to play chess together from 
different locations.

## How to Play

Playing chess with Chessl.ink is straightforward:

1. **Open the Website**: Visit [https://chessl.ink](https://chessl.ink) in your web browser.
2. **Share the Link**: Chessl.ink will provide you with a randomly generated link. Copy this link and share it with your friend whom you want to play with.
3. **Wait for Your Friend**: Your friend can open the shared link, and both of you will be connected to the same chessboard.
4. **Play Chess!**: Enjoy a game of chess with your friend! Make your moves by clicking and dragging the chess pieces. The game will keep track of the moves, and you can chat with your opponent in real-time.
5. **Game Over**: The game will continue until one of you wins by checkmate, a draw occurs, or you decide to end the game.

## Approaches used

- **State**: Managed using React Context and React Reducer.
- **TailwindCSS**: UI
- **TypeScript**: Typesafety
- **Next.js**: Allows server-side rendering and other useful features. Upon the initial visit, the returned website already contains an unique link.
- **WebSockets**: Chess moves are handled in real-time, enabling players to see their opponent's moves without refreshing the page. Each player is identifiable by unique sessionId. The game state is persistent, even if player closes the WS connection.
- **Redis**: In this project, Redis greatly simplifies session and linkage management, rendering the use of a relational database unnecessary.

## 👷‍♂️ 🚧 Work in progress

This project is still in an early stage of development

## TODO

 - Deploy on [https://chessl.ink](https://chessl.ink)
 - Monorepo
 - Error handling
 - UX improvements
 - GitHub Actions

![image](https://github.com/starvy/chesslink/assets/34771614/906c1901-edc1-4a1e-b6d3-a233c4be86d2)
