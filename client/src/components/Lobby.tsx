import React, { useEffect, useState } from "react";
import { useGame } from "../context/game";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import {
  Box,
  Paper,
  Button,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: "rgb(3,22,168, 0.75)",
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
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
  })
);

export type LobbyProps = {
  roomId: string;
};

const Lobby = () => {
  const game = useGame();
  const classes = useStyles();

  const [gameType, setGameType] = useState<string>("numbers");
  const [openTime, setOpenTime] = useState(false);
  const [openGame, setOpenGame] = useState(false);
  const [gameTime, setGameTime] = useState<string>("30");

  const handleChange = (
    event: React.ChangeEvent<{ value: unknown; name?: string | undefined }>
  ) => {
    if (event.target.name === "gametype") {
      setGameType(event.target.value as string);
    } else {
      setGameTime(event.target.value as string);
    }
  };

  const handleCloseTime = () => {
    setOpenTime(false);
  };

  const handleOpenTime = () => {
    setOpenTime(true);
  };

  const handleClose = () => {
    setOpenGame(false);
  };

  const handleOpen = () => {
    setOpenGame(true);
  };

  useEffect(() => {
    const socket = game?.state.socket;

    socket?.on("startGame", (data) => {
      if (data.mode === "letters") {
        const { mode, selection, solutions, time } = data;

        game?.updateState({
          gameStarted: true,
          gameMode: mode,
          selection: selection,
          solutions: solutions,
          time: time,
        });
      } else if (data.mode === "numbers") {
        const { mode, selection, target, solutions, time } = data;

        game?.updateState({
          gameStarted: true,
          gameMode: mode,
          selection: selection,
          targetNum: target,
          solutions: solutions,
          time: time,
        });
      }
    });
  }, [game]);

  const onStartGame = (e: any) => {
    const socket = game?.state.socket;
    console.log(gameType);
    console.log(gameTime);
    const body = {
      mode: gameType,
      time: gameTime,
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
        {game?.state.isHost ? (
          <Box>
            <FormControl className={classes.formControl}>
              <InputLabel>Game type</InputLabel>
              <Select
                open={openGame}
                onClose={handleClose}
                onOpen={handleOpen}
                name="gametype"
                value={gameType}
                onChange={handleChange}>
                <MenuItem value="numbers">Numbers</MenuItem>
                <MenuItem value="letters">Letters</MenuItem>
              </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel>Time to Play</InputLabel>
              <Select
                open={openTime}
                onClose={handleCloseTime}
                onOpen={handleOpenTime}
                name="time"
                value={gameTime}
                onChange={handleChange}>
                <MenuItem value="15">15 seconds</MenuItem>
                <MenuItem value="30">30 seconds</MenuItem>
                <MenuItem value="45">45 seconds</MenuItem>
                <MenuItem value="60">60 seconds</MenuItem>
                <MenuItem value="90">90 seconds</MenuItem>
                <MenuItem value="120">120 seconds</MenuItem>
              </Select>
            </FormControl>
          </Box>
        ) : null}
        <Typography variant="h6">Current players:</Typography>
        <ul>
          {game?.state?.roomUsers.map((user, index) => (
            <li key={index}>{user}</li>
          ))}
        </ul>
        {game?.state.isHost ? (
          <Button variant="contained" onClick={onStartGame} fullWidth>
            Start game
          </Button>
        ) : (
          <Box display="inline-box">
            <CircularProgress />
            <Typography variant="h6" style={{ marginLeft: "10px" }}>
              Waiting for host to start the game
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Lobby;
