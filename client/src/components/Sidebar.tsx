import React, { useState, useEffect } from "react";
import { useGame } from "../context/game"
import { isEnterKey } from "../util"

import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import { ListItem, ListItemText, TextField, Typography } from "@material-ui/core";

import LinearProgress from "@material-ui/core/LinearProgress"
import CircularProgress from "@material-ui/core/CircularProgress"
import { createStyles, makeStyles } from "@material-ui/styles";

const Leaderboard = () => {
  const game = useGame();
  const socket = game?.state.socket;

  const [progress, setProgress] = useState<Record<string, number>>({})

  useEffect(() => {
    game?.state.roomUsers.forEach((user) => {
      if (!(user in progress)) {
        setProgress({ ...progress, [user]: 0 })
      }
    })
    return () => {
      //
    }
  }, [game?.state.roomUsers])

  socket?.on("userBestGuess", (data, callback) => {
    setProgress({ ...progress, [data.username]: data.guessLength })
  })

  const maxScore = game?.state.gameMode === "letters" ?
    9 : game?.state.targetNum || 0

  return (
    <Grid style={{ width: "100%" }}>
      {
        Object.entries(progress).map(([user, amount]) => {
          amount = (amount / maxScore) * 100 // normalise between 0-100
          amount = Math.abs(amount)
          return (
            <>
              <Grid item xs={1}>
                <Typography variant="caption">
                  {user}
                </Typography>
                <LinearProgress variant="determinate" value={amount} />
              </Grid>

            </>

          )
        })
      }
    </Grid>
  )
}

const Chat = () => {
  const game = useGame();
  const [messages, setMessages] = useState<
    { username: string; message: string }[]
  >([]);
  const [message, setMessage] = useState("");

  const socket = game?.state?.socket;

  socket?.on("chatMessage", (data, callback) => {
    setMessages([...messages, data]);
  });

  const onSendMessage = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // if enter key pressed
    if (isEnterKey(e)) {
      socket?.emit("chatMessage", message, () => {
        setMessage("");
      });
    }
  };

  // TODO: fix text align
  return (
    <>
      <ul style={{ listStyleType: "none", paddingLeft: 5 }}>
        {messages.map(({ username, message }, index) => {
          const entry = `${username}: ${message}`
          const align = username === game?.state?.username
            ? "right" : "left";

          return (
            <li key={index} style={{ listStyleType: "none" }}>
              <p style={{ textAlign: align }}>
                <b>{username}: </b>{message}
              </p>
            </li>
          );
        })}
      </ul>
      <TextField id="outlined-basic" placeholder="Chat here" variant="outlined" onChange={(e) => setMessage(e.target.value)} onKeyDown={onSendMessage} />
    </>
  );
};

const Sidebar = () => {
  return (
    <>
      <div style={{ height: "50%" }}>
        <Leaderboard />
      </div>
      <div style={{ height: "50%" }}>
        <Chat />
      </div>
    </>
  );
};

export default Sidebar;
