import React from "react";
import { useGame } from "../context/game";
import { Numbers } from "./Numbers";
import Letters from "./Letters";
import Podium from "./Podium";

const GameRoom = () => {
  const game = useGame();
  const mode = game?.state.gameMode;

  switch (mode) {
    case "letters":
      return <Letters/>;
    case "numbers":
      return <Numbers />;
    case "podium":
      return <Podium />;
  }

  return <h1>Error: game started with no gamemode</h1>;
};

export default GameRoom;
