import React from "react";
import { useGame } from "../context/game";
import { Box, Button } from "@material-ui/core";

const Podium = () => {
  const game = useGame();
  const leaderboard = game?.state.leaderboard;
  const totalScores = game?.state.totalScores;
  let items = [];
  let elems = [];
  let itemsTotal = [];
  let elemsTotal = [];
  if (leaderboard !== undefined && totalScores !== undefined) {
    for (const user in leaderboard) {
      items.push({
        user: user,
        guess: leaderboard[user]["guess"],
        score: leaderboard[user]["score"],
      });
      itemsTotal.push({
        user: user,
        score: totalScores[user]
      })
    }
    items.sort((o1, o2) => {
      return o2["score"] < o1["score"] ? -1 : 1;
    });
    itemsTotal.sort((o1, o2) => {
      return o2["score"] < o1["score"] ? -1 : 1;
    });

    for (const a of items) {
      elems.push(
        <li>
          {a["user"] +
            ": came up with " +
            a["guess"] +
            " scoring " +
            a["score"]}
        </li>
      );
    }
    for (const a of itemsTotal) {
      elemsTotal.push(
        <li>
          {a["user"] +
            ": " +
            a["score"] + " points"}
        </li>
      );
    }
  }

  const onJoinRoom = (e: any) => {
    game?.updateState({
      gameStarted: false,
    });
  };

  return (
    <Box>
      <div>
        <h2>Round Scores</h2>
        <ol>{elems}</ol>
      </div>
      <div>
        <h2>Cumulative Scores</h2>
        <ol>{elemsTotal}</ol>
      </div>
      <h2>Possible Solution:</h2>
      <p>{game?.state.solutions?.join(" ")}</p>
      <Button variant="contained" onClick={onJoinRoom}>
        Return to Lobby
      </Button>
    </Box>
  );
};

export default Podium;
