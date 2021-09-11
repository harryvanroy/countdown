import React, { useState } from "react";
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
  const [answer, setAnswer] = useState("");
  const [currentTotal, setTotal] = useState(0);
  const classes = useStyles();
  const game = useGame();

  const handleCheckAnswer = () => {
    const answerSafe = answer.replace(/[^-()\d/*+.]/g, "");
    console.log(answerSafe);
    setTotal(eval(answerSafe));
  };

  const handleAnswerChange = (event: any) => {
    setAnswer(event.target.value);
    console.log(event.target.value);
  };

  return (
    <Box className={classes.root}>
      <Paper>
        <TextField
          id="outlined-multiline-static"
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
        <p>Current value: {currentTotal}</p>
      </Paper>
    </Box>
  );
};
