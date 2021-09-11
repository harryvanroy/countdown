import React, { useEffect, useState } from "react";
import { useGame } from "../context/game";

export type LobbyProps = {
  roomId: string;
};

const Lobby = () => {
  const game = useGame();
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const socket = game?.state.socket;
    socket?.on("message", (message: string) => {
      setMessages([...messages, message]);
    });
  }, [game?.state.socket, messages]);

  return (
    <>
      <h1>Lobby</h1>
      <h2>Room: {game?.state.roomId}</h2>
      <h3>Game started? {game?.state.gameStarted ? "y" : "n"}</h3>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
    </>
  );
};

export default Lobby;
