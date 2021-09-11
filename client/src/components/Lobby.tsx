import React, { useEffect, useState } from "react";
import { useGame } from "../context/game";

export type LobbyProps = {
  roomId: string;
};

const Lobby = () => {
  const game = useGame();
  const [messages, setMessages] = useState<string[]>([]);
  /*   const [letterRounds, setLetterRounds] = useState(2);
  const [numberRounds, setNumberRounds] = useState(2); */

  useEffect(() => {
    const socket = game?.state.socket;
    socket?.on("message", (message: string) => {
      setMessages([...messages, message]);
    });

    socket?.on("startGame", (data) => {
      if (data.mode === "letters") {
        const { mode, selection, solutions } = data;

        game?.updateState({
          gameStarted: true,
          gameMode: mode,
          selection: selection,
          solutions: solutions,
        });
      } else if (data.mode === "numbers") {
        const { mode, selection, target, solutions } = data;

        game?.updateState({
          gameStarted: true,
          gameMode: mode,
          selection: selection,
          targetNum: target,
          solutions: solutions,
        });
      }
    });
  }, [game, game?.state.socket, messages]);

  const onStartGame = (e: any) => {
    const socket = game?.state.socket;
    const body = {
      mode: "letters", // TODO
    };

    socket?.emit("startGame", body, (response: any) => {
      const { error } = response || {};

      if (error) {
        alert(error);
      }
    });
  };

  return (
    <>
      <h1>Lobby</h1>
      <h2>Room: {game?.state.roomId}</h2>
      <h3>Game started? {game?.state.gameStarted ? "y" : "n"}</h3>
      {/*       <input
        type="number"
        name="numberRounds"
        placeholder="number rounds"
        min={0}
        onChange={(e) => {
          setNumberRounds(parseInt(e.target.value));
        }}
      />
      <input
        type="number"
        name="letterRounds"
        placeholder="letter rounds"
        min={0}
        onChange={(e) => {
          setLetterRounds(parseInt(e.target.value));
        }}
      /> */}
      <button onClick={onStartGame}>Start game</button>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
    </>
  );
};

export default Lobby;
