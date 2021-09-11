import React from "react";
import Home from "./Home";
import Lobby from "./Lobby";
import GameRoom from "./GameRoom";
import { GameContextProvider, useGame } from "../context/game";

const ContextApp = () => {
  const game = useGame();

  const { roomId, gameStarted } = game?.state || {};

  if (roomId) {
    return gameStarted ? <GameRoom /> : <Lobby />;
  }

  return <Home />;
};

function App() {
  return (
    <GameContextProvider>
      <ContextApp />
    </GameContextProvider>
  );
}

export default App;
