import React, { useState, useEffect } from "react";
import { useGame } from "../context/game";
import io from "socket.io-client";

const Home = () => {
  const game = useGame();
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");

  useEffect(() => {
    const socket = io(`http://localhost:8080`, {
      transports: ["websocket", "polling", "flashsocket"],
    });
    game?.updateState({ socket });
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

  const onJoinRoom = (e: any) => {
    const socket = game?.state.socket;

    socket?.emit("joinRoom", { username, room: roomId }, (response: any) => {
      const { error, user } = response || {};

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
      <button onClick={onCreateRoom}>Create room</button>
      <label htmlFor="roomId">Room Id:</label>
      <input
        type="text"
        id="roomId"
        name="roomId"
        onChange={(e) => setRoomId(e.target.value)}
      />
      <button onClick={onJoinRoom}>Join room</button>
    </>
  );
};

export default Home;
