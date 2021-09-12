import React from "react";
import { useGame } from "../context/game";
import { Box, Button, Typography, Paper, List, ListItem, ListItemText, Badge, Divider } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    backgroundColor: "rgb(35,65,119)",
    height: "100vh",
    color: "white",
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
    padding: "25px",
  },
});

const Podium = () => {
  const game = useGame();
  const leaderboard = game?.state.leaderboard;
  const totalScores = game?.state.totalScores;

  const classes = useStyles();

  let items = [];
  let elems = [];
  let itemsTotal = [];
  let elemsTotal = [];
  if (leaderboard !== undefined && totalScores !== undefined) {
    for (const user in leaderboard) {
      items.push({
        user: user,
        guess: leaderboard[user]["guess"],
        score: leaderboard[user]["score"],
      });
    }
    for (const user in totalScores) {
      itemsTotal.push({
        user: user,
        score: totalScores[user],
      });
    }
    items.sort((o1, o2) => {
      return o2["score"] < o1["score"] ? -1 : 1;
    });
    itemsTotal.sort((o1, o2) => {
      return o2["score"] < o1["score"] ? -1 : 1;
    });

    for (const a of items) {
      elems.push(
        <li>
          {a["user"] +
            ": came up with " +
            a["guess"] +
            " scoring " +
            a["score"]}
        </li>
      );
    }
    for (const a of itemsTotal) {
      elemsTotal.push(<li>{a["user"] + ": " + a["score"] + " points"}</li>);
    }
  }

  const onJoinRoom = (e: any) => {
    game?.updateState({
      gameStarted: false,
    });
  };

  return (
    <Box
      className={classes.root}
      display="flex"
      justifyContent="center"
      flexDirection="column"
      alignItems="center">
      <Paper className={classes.paper}>
        <Box>
          <Typography variant="h4">Round Scores</Typography>
          <ol>{elems}</ol>
        </Box>
        <Box>
          <Typography variant="h4">Cumulative Scores</Typography>
          <ol>{elemsTotal}</ol>
        </Box>
        <Typography variant="h4"> Top Solutions:</Typography>
        {
          game?.state?.solutions ?
            <List dense disablePadding>
              {game?.state.solutions?.slice(0, Math.min(6, game?.state?.solutions.length)).map((solution) => (
                <ListItem>
                  <ListItemText primary={solution} />
                </ListItem>
              ))}
            </List> :
            <p>N/A</p>
        }

        {/* <Typography>{game?.state.solutions?.slice(0, 6).join(" ")}</Typography> */}
        <Divider/>
        <Button variant="contained" onClick={onJoinRoom}>
          Return to Lobby
        </Button>
      </Paper>
    </Box>
  );
};

export default Podium;
