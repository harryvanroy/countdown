import React from 'react';
import { useGame } from '../context/game'

const Letters = () => {
  const game = useGame();
  const letters = game?.state.selection;
  console.log({letters})

  return (
    <h1>{Array.isArray(letters) ? letters.join("") : "??"}</h1>
  )
}

export default Letters