import React, { useEffect, useState } from "react";
import { User } from "../../../common/socket";
import { useGame } from "../context/game";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Paper, Button, Typography } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    backgroundColor: "rgb(43, 86, 163)",
    height: "100vh",
  },
  username: {
    margin: "10px 0",
  },
  content: {
    padding: "15px",
    width: "400px",
  },
  button: {
    float: "left",
    width: "180px",
  },
});

export type LobbyProps = {
  roomId: string;
};

const Lobby = () => {
  const game = useGame();
  const [users, setUsers] = useState<User[]>([]);

  const classes = useStyles();
  /*   const [letterRounds, setLetterRounds] = useState(2);
  const [numberRounds, setNumberRounds] = useState(2); */

  useEffect(() => {
    const socket = game?.state.socket;
    socket?.on("roomUsers", ({ users }) => {
      setUsers(users);
    });

    socket?.on("startGame", (data) => {
      if (data.mode === "letters") {
        const { mode, selection, solutions } = data;

        game?.updateState({
          gameStarted: true,
          gameMode: mode,
          selection: selection,
          solutions: solutions,
        });
      } else if (data.mode === "numbers") {
        const { mode, selection, target, solutions } = data;

        game?.updateState({
          gameStarted: true,
          gameMode: mode,
          selection: selection,
          targetNum: target,
          solutions: solutions,
        });
      }
    });
  }, [game, game?.state.socket, users]);

  const onStartGame = (e: any) => {
    const socket = game?.state.socket;
    const body = {
      mode: "numbers",
    };

    socket?.emit("startGame", body, (response: any) => {
      const { error } = response || {};

      if (error) {
        alert(error);
      }
    });
  };

  return (
    <Box
      className={classes.root}
      display="flex"
      justifyContent="center"
      alignItems="center">
      <Paper className={classes.content}>
        <Typography variant="h4">Lobby</Typography>
        <Typography variant="h6">RoomID: {game?.state.roomId}</Typography>
        <Typography variant="caption">
          Send the RoomID to your friends so they can join the lobby.
        </Typography>
        <Typography variant="h6">Current players:</Typography>
        <ul>
          {users.map((user, index) => (
            <li key={index}>{user.username}</li>
          ))}
        </ul>
        <Button variant="contained" onClick={onStartGame} fullWidth>
          Start game
        </Button>
      </Paper>
    </Box>
  );
};

export default Lobby;
