import React from "react";
import { useGame } from '../context/game';
import Numbers, { SimpleCard } from './Numbers'

const GameRoom = () => {
  const game = useGame();

  return (
    game?.state.gameMode === 'letters' ? 
      <h1>Game room (letters)</h1> :
      <>
        <Numbers />
        <SimpleCard />
      </>
  );
};

export default GameRoom;
