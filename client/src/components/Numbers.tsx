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
  const gameTime = game?.state.time === undefined ? 30 : parseInt(game.state.time)
  const [seconds, setSeconds] = useState(gameTime);
  //inside your component function.
  const [audio] = useState(new Audio("./static/countdown.mp3"));
  if (gameTime < 30 && audio.currentTime == 0) {
    audio.currentTime = gameTime
  }
  const [isPlaying, setIsPlaying] = useState(false);

  console.log(audio.currentTime)
  useEffect(() => {
    isPlaying ? audio.play() : audio.pause();
  }, [isPlaying]);

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
        totalScores: data.totalScores
      });
    });
  }, [game]);

  useEffect(() => {
    if (seconds > 0) {
      setIsPlaying((seconds - gameTime) < 30)
      setTimeout(() => setSeconds(seconds - 1), 1000);
    } else {
      setIsPlaying(false)
    }
  });

  return (
    <Box
      className={classes.root}
      display="flex"
      justifyContent="center"
      alignItems="center">
      <Paper>
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
        <p>Selection: {game?.state.selection?.join()}</p>
        <p>Target: {game?.state.targetNum}</p>
        <p>Seconds left: {seconds} </p>
        <Box></Box>
      </Paper>
    </Box>
  );
};
