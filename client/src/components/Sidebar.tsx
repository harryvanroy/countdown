import React, { useState } from "react";
import { useGame } from "../context/game";

import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import { ListItem, ListItemText } from "@material-ui/core";

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

  const onSendMessage = (e: any) => {
    // if enter key pressed
    if (e.keyCode === 13) {
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
          const entry = `${username}:${message}`;
          const align = username === game?.state?.username ? "right" : "left";

          return (
            <li key={index} style={{ listStyleType: "none" }}>
              <p style={{ textAlign: align }}>{entry}</p>
            </li>
          );
        })}
      </ul>
      <input
        type="text"
        placeholder={"Chat here"}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={onSendMessage}
      />
    </>
  );
};

const Leaderboard = () => {
  const game = useGame();

  return (
    <ol>
      {game?.state?.roomUsers.map((user) => {
        return <li>{user}</li>;
      })}
    </ol>
  );
};

const Sidebar = () => {
  return (
    <>
      <Grid container>
        <Grid item xs={1}>
          <Leaderboard />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={9}>
          <Chat />
        </Grid>
      </Grid>
    </>
  );
};

export default Sidebar;
