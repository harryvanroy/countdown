import React, { useState } from "react";
import { useGame } from "../context/game";
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Snackbar,
} from "@material-ui/core";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";

const Alert = (props: JSX.IntrinsicAttributes & AlertProps) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

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
  createRoomButton: {
    marginBottom: "10px",
  },
  roomInput: {
    float: "right",
    width: "180px",
  },
  joinRoomBox: {
    width: "100%",
    marginTop: "10px",
  },
});

const Home = () => {
  const game = useGame();
  const [username, setUsername] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");
  const [error, setError] = useState<string>("");

  const classes = useStyles();

  const onCreateRoom = (_: any) => {
    if (username === "") {
      setError("Username is not set");
      return;
    }

    const socket = game?.state.socket;
    socket?.emit("createRoom", { username }, (response: any) => {
      const { error, user } = response || {};

      if (error) {
        setError(error);
      } else {
        game?.updateState({
          username: username || "",
          roomId: user.roomID,
        });
      }
    });
  };

  const onJoinRoom = (e: any) => {
    const socket = game?.state.socket;

    socket?.emit("joinRoom", { username, room: roomId }, (response: any) => {
      const { error, user } = response || {};

      if (error) {
        setError(error);
      } else {
        game?.updateState({
          username: username || "",
          roomId: roomId,
        });
      }
    });
  };

  const handleClose = () => {
    setError("");
  };

  return (
    <Box
      className={classes.root}
      display="flex"
      justifyContent="center"
      alignItems="center">
      <Paper className={classes.content}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column">
          <Typography variant="h3">Countdown</Typography>
          <TextField
            id="username"
            name="username"
            placeholder="Enter username"
            className={classes.username}
            fullWidth
            onChange={(e) => setUsername(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={onCreateRoom}
            className={classes.createRoomButton}
            fullWidth>
            Create room
          </Button>
          or
          <Box className={classes.joinRoomBox}>
            <Button
              variant="contained"
              onClick={onJoinRoom}
              className={classes.button}>
              Join room
            </Button>
            <TextField
              id="roomID"
              name="roomID"
              placeholder="Enter RoomID"
              className={classes.roomInput}
              onChange={(e) => setRoomId(e.target.value)}
            />
          </Box>
        </Box>
      </Paper>
      {error ? (
        <Snackbar open={true} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error">
            {error}
          </Alert>
        </Snackbar>
      ) : null}
    </Box>
  );
};

export default Home;
