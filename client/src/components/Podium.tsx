import React from 'react'
import { useGame } from '../context/game';
import { Box, Button, } from "@material-ui/core";


const Podium = () => {
  const game = useGame();
  const leaderboard = game?.state.leaderboard;
  let items = []
  if (leaderboard !== undefined) {
    for (const user in leaderboard) {
      items.push(<li>{user + ": "
        + leaderboard[user]["guess"]
        + " scoring " + leaderboard[user]["score"]}
      </li>)
    }
  }

  const onJoinRoom = (e: any) => {
    const socket = game?.state.socket;
    game?.updateState({
      gameStarted: false
    });
    // socket?.emit("joinRoom", (game?.state.), (response: any) => {
    //   const { error, user } = response || {};
    //   game?.updateState({
    //     username: game.state || "",
    //     roomId: roomId,
    //   });
    // });
  };


  return (
    <Box>
      <ol>{items}</ol>
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