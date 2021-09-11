import React, { useEffect, useState } from "react";
import { useGame } from "../context/game";

export type LobbyProps = {
  roomId: string;
};

const Lobby = () => {
  const game = useGame();
  const [messages, setMessages] = useState<string[]>([]);

  const messageHandler = (message: string) => {
    setMessages(messages.concat(message));
  };

  useEffect(() => {
    const socket = game?.state.socket;
    socket?.on("message", messageHandler);
  }, []);

  return (
    <>
      <h1>Lobby</h1>
      <h2>Room: {game?.state.roomId}</h2>
      <h3>Game started? {game?.state.gameStarted ? "y" : "n"}</h3>
      <ul>
        {messages.map((message) => {
          <li>message</li>;
        })}
      </ul>
    </>
  );
};

export default Lobby;
