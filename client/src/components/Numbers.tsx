import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, TextField, Paper, Button, Typography } from "@material-ui/core";
import { useGame } from "../context/game";
import { isEnterKey } from "../util";

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
  const gameTime =
    game?.state.time === undefined ? 30 : parseInt(game.state.time);
  const [seconds, setSeconds] = useState(gameTime);
  //inside your component function.
  const [audio] = useState(new Audio("./static/countdown.mp3"));
  if (gameTime < 30 && audio.currentTime == 0) {
    audio.currentTime = gameTime;
  }
  const [isPlaying, setIsPlaying] = useState(false);

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
    setAnswer("");
  };

  const handleAnswerChange = (event: any) => {
    setAnswer(event.target.value);
  };

  const handleKeyDown = (event: any) => {
    if (isEnterKey(event)) {
      handleCheckAnswer();
    }
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
      setIsPlaying(true);
      if (audio.currentTime >= 15 && seconds > 15) {
        audio.currentTime = Math.min(30 - seconds, 2);
      }
      setTimeout(() => setSeconds(seconds - 1), 1000);
    } else {
      setIsPlaying(false);
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
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexWrap="wrap"
        className={classes.selectionsBox}>
        {game?.state.selection?.map((value, index) => (
          <Box
            key={index}
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
            fullWidth
            value={answer}
            variant="outlined"
            placeholder="Enter your answer"
            onChange={handleAnswerChange}
            onKeyDown={handleKeyDown}
          />
        </Paper>
      </Box>
    </Box>
  );
};
