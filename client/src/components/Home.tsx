import React, { useState } from "react";
import { useGame } from "../context/game";
import io, { Socket } from "socket.io-client";
import { createRoom } from '../api'

const Home = () => {
  const game = useGame();
  const [username, setUsername] = useState("");

  const initSocket = () => {
    if (game && !game.state.socket) {
      const socket = io(`http://${window.location.hostname}:3000`);
      game.updateState({socket});
    }
  }

  const onCreateRoom = (_: any) => {
    if (username === "") {
      alert("Username is not set");
      return;
    }

    initSocket();
    const socket = game?.state.socket;

    socket?.emit("createRoom", (response: any) => {
      const { error, user } = response || {};

      if (error) {
        alert(error);
      } else if (!error || !user) {
        alert("Didn't return user.")
      } else {
        const { username, roomID, isHost } = user;
        game?.updateState({
          roomId: roomID,
        })
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
