import React, { useEffect, useState } from "react";
import { User } from "../../../common/socket";
import { useGame } from "../context/game";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { Box, Paper, Button, Typography } from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
  const [users, setUsers] = useState<string[]>([]);
  const classes = useStyles();

  const [gameType, setGameType] = React.useState<string>("numbers");
  const [open, setOpen] = React.useState(false);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setGameType(event.target.value as string);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  /*   const [letterRounds, setLetterRounds] = useState(2);
  const [numberRounds, setNumberRounds] = useState(2); */

  useEffect(() => {
    if (game?.state.username) {
      setUsers([game?.state.username]);
    }

    console.log(game?.state.username);

    const socket = game?.state.socket;
    socket?.on("roomUsers", ({ users }) => {
      const usernames = users.map((user) => user.username);
      setUsers(usernames);
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
  }, [game]);

  const onStartGame = (e: any) => {
    const socket = game?.state.socket;
    console.log(gameType);
    const body = {
      mode: gameType,
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
            <li key={index}>{user}</li>
          ))}
        </ul>
        <div>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-controlled-open-select-label">
              Numbers
            </InputLabel>
            <Select
              labelId="demo-controlled-open-select-label"
              id="demo-controlled-open-select"
              open={open}
              onClose={handleClose}
              onOpen={handleOpen}
              value={gameType}
              onChange={handleChange}>
              <MenuItem value="numbers">Numbers</MenuItem>
              <MenuItem value="letters">Letters</MenuItem>
            </Select>
          </FormControl>
        </div>
        <Button variant="contained" onClick={onStartGame} fullWidth>
          Start game
        </Button>
      </Paper>
    </Box>
  );
};

export default Lobby;
