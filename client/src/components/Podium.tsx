import React from 'react'
import { useGame } from '../context/game';
import { Box, Button, } from "@material-ui/core";


const Podium = () => {
  const game = useGame();
  const leaderboard = game?.state.leaderboard;
  let items = []
  let elems = []
  if (leaderboard !== undefined) {
    for (const user in leaderboard) {
      items.push({
        user: user,
        guess: leaderboard[user]["guess"],
        score: leaderboard[user]["score"]
      })
    }
    items.sort((o1, o2) => {
      return (o2["score"] < o1["score"]) ? -1 : 1;
    })

    for (const a of items) {
      elems.push(<li>{a["user"] + ": came up with "
        + a["guess"] + " scoring " + a["score"]}</li>)
    }
  }

  const onJoinRoom = (e: any) => {
    const socket = game?.state.socket;
    game?.updateState({
      gameStarted: false
    });
  };


  return (
    <Box>
      <ol>{elems}</ol>
      <h2>Possible Solution:</h2>
      <p>{game?.state.solutions?.join(" ")}</p>
      <Button
        variant="contained"
        onClick={onJoinRoom}>
        Return to Lobby
      </Button>
    </Box >
  );
}

export default Podium