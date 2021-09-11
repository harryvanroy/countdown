<<<<<<< HEAD
import React, { useState } from "react";
import { useGame } from "../context/game";
import { makeNewRoom } from "../api";
import io from "socket.io-client";
=======
import React from 'react';
import { useGame } from '../context/game';
import { createRoom } from '../api'
>>>>>>> ed620c865752797ca5fa2cc16cc20c7799ba6b0a

const Home = () => {
  const game = useGame();
  const [username, setUsername] = useState("");

  const onCreateRoom = (_: any) => {
<<<<<<< HEAD
    if (username === "") {
      alert("Username is not set");
      return;
=======
    try {
      const roomId = createRoom();
      game?.updateState({roomId});
    } catch (e: any) {
      // TODO
      alert(e?.message)
>>>>>>> ed620c865752797ca5fa2cc16cc20c7799ba6b0a
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
