import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, TextField, Paper } from "@material-ui/core";
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

  return (
    <Box className={classes.root}>
      <Paper>
        <TextField
          className={classes.workingOut}
          id="outlined-multiline-static"
          multiline
          rows={16}
          defaultValue=""
          variant="outlined"
        />
        <TextField
          id="outlined-multiline-static"
          multiline
          rows={3}
          defaultValue=""
          variant="outlined"
        />
        <input type="submit" value="Submit" />
        <p>Selection: {game?.state.selection?.join()}</p>
        <p>Target: {game?.state.targetNum}</p>
      </Paper>
    </Box>
  );
};
