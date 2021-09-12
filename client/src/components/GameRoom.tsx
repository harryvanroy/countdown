import React from "react";
import { useGame } from "../context/game";
import { Numbers } from "./Numbers";
import { Letters } from "./Letters";
import Sidebar from "./Sidebar";
import Podium from "./Podium";

import Grid from "@material-ui/core/Grid";

const GameArea = () => {
  const game = useGame();
  const mode = game?.state.gameMode;

  switch (mode) {
    case "letters":
      return <Letters />;
    case "numbers":
      return <Numbers />;
    case "podium":
      return <Podium />;
  }

  return <h1>Unknown game mode</h1>;
};

const GameRoom = () => {
  return (
    <Grid container spacing={0}>
      <Grid item xs={8}>
        <GameArea />
      </Grid>
      <Grid item xs={2}>
        <Sidebar />
      </Grid>
    </Grid >
  );
};

export default GameRoom;
