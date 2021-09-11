import React, { useState, useEffect } from "react";
import { useGame } from "../context/game";
import io from "socket.io-client";

const Home = () => {
  const game = useGame();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const socket = io(`http://localhost:8080`, {
      transports: ["websocket", "polling", "flashsocket"],
    });
    game?.updateState({ socket });
    return () => {
      socket.close();
    };
  }, []);

  const onCreateRoom = (_: any) => {
    if (username === "") {
      alert("Username is not set");
      return;
    }

    const socket = game?.state.socket;
    socket?.emit("createRoom", { username }, (response: any) => {
      const { error, user } = response || {};
      console.log(response);

      if (error) {
        alert(error);
      } else {
        game?.updateState({
          roomId: user.roomID,
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
