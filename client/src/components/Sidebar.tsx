import React, { useState, useEffect } from "react";
import { useGame } from "../context/game";
import { isEnterKey } from "../util";

import Grid from "@material-ui/core/Grid";
import { TextField, Typography, Box } from "@material-ui/core";

import LinearProgress from "@material-ui/core/LinearProgress";

const Leaderboard = () => {
  const game = useGame();
  const socket = game?.state.socket;

  const maxScore =
    game?.state.gameMode === "letters" ? 9 : game?.state.targetNum || 0;

  const [progress, setProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    console.log(game?.state.roomUsers);
    game?.state.roomUsers.forEach((user) => {
      if (!(user in progress)) {
        setProgress({ ...progress, [user]: maxScore });
      }
    });
  }, [game?.state.roomUsers, maxScore, progress]);

  socket?.on("userBestGuess", (data, callback) => {
    setProgress({ ...progress, [data.username]: data.delta });
  });

  const capitalizeFirstLetter = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  return (
    <Grid style={{ padding: "20px" }}>
      {game?.state.gameMode ? (
        <Typography variant="h4">
          {capitalizeFirstLetter(game?.state.gameMode)}
        </Typography>
      ) : null}
      {Object.entries(progress).map(([user, delta]) => {
        const currGuess = maxScore - delta;
        const currGuessNorm = Math.min((currGuess / maxScore) * 100, 100);

        return (
          <Box key={user}>
            <Grid item xs={12}>
              <Typography variant="caption">{user}</Typography>
              <LinearProgress variant="determinate" value={currGuessNorm} />
            </Grid>
          </Box>
        );
      })}
    </Grid>
  );
};

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

      setMessage("");
    }
  };

  // TODO: fix text align
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      height="100%">
      <Box padding="20px">
        <ul style={{ listStyleType: "none", paddingLeft: 5 }}>
          {messages.map(({ username, message }, index) => {
            const entry = `${username}: ${message}`;
            const align = username === game?.state?.username ? "right" : "left";

            return (
              <li key={index} style={{ listStyleType: "none" }}>
                <p style={{ textAlign: align }}>
                  <b>{username}: </b>
                  {message}
                </p>
              </li>
            );
          })}
        </ul>
      </Box>
      <TextField
        id="outlined-basic"
        placeholder="Chat here"
        variant="outlined"
        fullWidth
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ borderRadius: "0px" }}
        onKeyDown={onSendMessage}
      />
    </Box>
  );
};

const Sidebar = () => {
  return (
    <Box height="100vh">
      <Box style={{ height: "25%" }}>
        <Leaderboard />
      </Box>
      <Box style={{ height: "75%" }}>
        <Chat />
      </Box>
    </Box>
  );
};

export default Sidebar;
