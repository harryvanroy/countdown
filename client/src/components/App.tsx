import React from "react";
import logo from "./logo.svg";
import Home from "./Home";
import { Numbers, SimpleCard } from "../numbers";
import Lobby, { LobbyProps } from "./Lobby";
import GameRoom from "./GameRoom";
import { GameContextProvider, useGame } from '../context/game';

const ContextApp = () => {
  const game = useGame();

  const { roomId, gameStarted } = game?.state || {};

  if (roomId) {
    return gameStarted ? <GameRoom/> : <Lobby/>
  } 

  return (
    <Home/>
  )
}

function App() {
  return (
    <GameContextProvider>
      <ContextApp/>
    </GameContextProvider>
  );
}

export default App;
