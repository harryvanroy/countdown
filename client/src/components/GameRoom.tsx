import React from "react";
import { useGame } from "../context/game";
import { Numbers } from "./Numbers";
import Podium from "./Podium";

const GameRoom = () => {
  const game = useGame();
  const mode = game?.state.gameMode;

  switch (mode) {
    case "letters":
      return <h1>Letters</h1>;
    case "numbers":
      return <Numbers />;
    case "podium":
      return <Podium />;
  }

  return <h1>Error: game started with no gamemode</h1>;
};

export default GameRoom;
