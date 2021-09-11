import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, TextField, Paper, Button } from "@material-ui/core";
import { useGame } from "../context/game";

const useStyles = makeStyles({
  root: {
    backgroundColor: "rgb(43, 86, 163)",
    height: "100vh",
  },
  workingOut: {
    width: 500,
  },
});

export const Numbers = () => {
  const classes = useStyles();
  const game = useGame();
  const [answer, setAnswer] = useState("");
  const [currentTotal, setTotal] = useState(0);
  const [seconds, setSeconds] = useState(game?.state.time === undefined ? 30 : parseInt(game.state.time));


  const handleCheckAnswer = () => {
    const socket = game?.state.socket;

    socket?.emit("numbersGuess", answer, (response: any) => {
      const { error } = response || {};

      if (error) {
        alert(error);
      }
    });
  };

  const handleAnswerChange = (event: any) => {
    setAnswer(event.target.value);
    console.log(event.target.value);
  };

  useEffect(() => {
    if (seconds > 0) {
      setTimeout(() => setSeconds(seconds - 1), 1000);
    } else {
      alert("time done");
    }
  });

  return (
    <Box className={classes.root}>
      <Paper>
        <TextField
          multiline
          rows={3}
          value={answer}
          variant="outlined"
          onChange={handleAnswerChange}
        />
        <Button variant="contained" onClick={handleCheckAnswer}>
          Check answer
        </Button>
        <p>Selection: {game?.state.selection?.join()}</p>
        <p>Target: {game?.state.targetNum}</p>
        <p>Seconds left: {seconds} </p>
        {seconds === 0 && <p>Solutions {game?.state.solutions?.slice(0, 1)}</p>}
        <Box></Box>
      </Paper>
    </Box>
  );
};
