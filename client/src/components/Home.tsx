import React, { useState } from "react";
import { useGame } from "../context/game";
import io, { Socket } from "socket.io-client";

const Home = () => {
  const game = useGame();
  const [username, setUsername] = useState("");

  const initSocket = () => {
    if (game && !game.state.socket) {
      const socket = io(`http://localhost`, {
        transports: ["websocket", "polling", "flashsocket"],
      });
      game.updateState({ socket });
    }
  };

  const onCreateRoom = (_: any) => {
    if (username === "") {
      alert("Username is not set");
      return;
    }

    initSocket();
    const socket = game?.state.socket;
    socket?.emit("createRoom", { username }, (response: any) => {
      const { error, user } = response || {};
      console.log(response)

      if (error) {
        alert(error);
      } else {
        const { username, roomID, isHost } = user;
        game?.updateState({
          roomId: roomID,
        });
      }
    });
  };

  return (
    <>
      <label htmlFor="username">Username:</label>
      <input
        type="text"
        id="username"
        name="username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <h1>{game?.state.roomId}</h1>
      <button onClick={onCreateRoom}>Create room</button>
      <button>Join room</button>
    </>
  );
};

export default Home;
