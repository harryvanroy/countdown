import React, { useContext, createContext, useState } from "react";
import { Socket } from "socket.io-client";

type State = {
  roomId: string | null;
  socket: Socket | null;
  isHost: boolean;
  gameStarted: boolean;
  gameMode: "letters" | "numbers" | "podium" | null;
};

const defaultState: State = {
  roomId: null,
  socket: null,
  isHost: false,
  gameStarted: false,
  gameMode: null,
};

type GameContextValue = {
  state: State;
  updateState: (newState: Partial<State>) => void;
} | null;

export const gameContext = createContext<GameContextValue>(null);

type GameContextProviderProps = {
  children: React.ReactNode;
};

export const GameContextProvider = (props: GameContextProviderProps) => {
  const [state, setState] = useState<State>(defaultState);

  const updateState = (newState: Partial<State>) => {
    setState({ ...state, ...newState });
  };

  const value = {
    state,
    updateState,
  };

  return (
    <gameContext.Provider value={value}>{props.children}</gameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(gameContext);

  if (context === undefined) {
    throw new Error("useContext must be used within a ContextProvider.");
  }

  return context;
};