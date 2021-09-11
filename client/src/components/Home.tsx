import React, { useState } from "react";
import { useGame } from "../context/game";
import { makeNewRoom } from "../api";
import io from "socket.io-client";

const Home = () => {
  const game = useGame();
  const [username, setUsername] = useState("");

  const onCreateRoom = (_: any) => {
    if (username === "") {
      alert("Username is not set");
      return;
    }
    const socket = io(`http://${window.location.hostname}:3000`);
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
