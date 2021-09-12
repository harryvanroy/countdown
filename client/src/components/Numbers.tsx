import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, TextField, Paper, Button, Typography } from "@material-ui/core";
import { useGame } from "../context/game";

const useStyles = makeStyles({
  root: {
    backgroundColor: "rgb(35,65,119)",
    height: "100vh",
  },
  workingOut: {
    width: 500,
  },
  boxes: {
    border: "1px solid white",
    color: "white",
    backgroundColor: "rgb(42, 66, 157)",
    margin: "10px 0",
  },
  targetBox: {
    border: "5px solid white",
    color: "white",
    backgroundColor: "rgb(42, 66, 157)",
  },
  selectionsBox: {
    margin: "30px 0",
  },
  timer: {
    color: "white",
    margin: "10px",
  },
  paper: {
    margin: "10px",
  },
});

export const Numbers = () => {
  const classes = useStyles();
  const game = useGame();
  const [answer, setAnswer] = useState("");
  const [seconds, setSeconds] = useState(
    game?.state.time === undefined ? 30 : parseInt(game.state.time)
  );

  const handleCheckAnswer = () => {
    const socket = game?.state.socket;

    socket?.emit("guess", answer, (response: any) => {
      const { error } = response || {};

      if (error) {
        alert(error);
      }
    });
  };

  const handleAnswerChange = (event: any) => {
    setAnswer(event.target.value);
  };

  useEffect(() => {
    const socket = game?.state.socket;

    socket?.on("startPodium", (data) => {
      game?.updateState({
        gameMode: "podium",
        leaderboard: data.leaderboard,
        totalScores: data.totalScores,
      });
    });
  }, [game]);

  useEffect(() => {
    if (seconds > 0) {
      setTimeout(() => setSeconds(seconds - 1), 1000);
    }
  });

  return (
    <Box
      className={classes.root}
      display="flex"
      justifyContent="center"
      flexDirection="column"
      alignItems="center">
      <Box
        width="200px"
        height="100px"
        className={classes.targetBox}
        display="flex"
        justifyContent="center"
        alignItems="center">
        <Typography variant="h1">{game?.state.targetNum}</Typography>
      </Box>
      <Box display="inline-box" className={classes.selectionsBox}>
        {game?.state.selection?.map((value, index) => (
          <Box
            width="100px"
            height="100px"
            className={classes.boxes}
            display="flex"
            justifyContent="center"
            alignItems="center">
            <Typography variant="h3">{value}</Typography>
          </Box>
        ))}
      </Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box className={classes.timer}>
          <Typography variant="h1">{seconds}s</Typography>
        </Box>
        <Paper className={classes.paper}>
          <TextField
            multiline
            rows={3}
            fullWidth
            value={answer}
            variant="outlined"
            placeholder="Enter your answer"
            onChange={handleAnswerChange}
          />
          <Button variant="contained" onClick={handleCheckAnswer} fullWidth>
            Check answer
          </Button>
        </Paper>
      </Box>
    </Box>
  );
};
