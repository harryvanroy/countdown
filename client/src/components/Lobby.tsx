import React from 'react';
import { useGame } from '../context/game';

export type LobbyProps = {
  roomId: string;
};

const Lobby = () => {
  const game = useGame();

  return (
    <>
      <h1>Lobby</h1>
      <h2>Room: {game?.state.roomId}</h2>
      <h3>Game started? {game?.state.gameStarted ? "y" : "n"}</h3>
    </>
  );
};

export default Lobby;
