import React, { useContext, createContext, useState } from "react";
import { Socket } from "socket.io-client";
import { ClientListenEvents, ClientEmitEvents } from '../../../common/socket'

type State = {
  roomId: string | null;
  socket: Socket<ClientListenEvents, ClientEmitEvents> | null;
  isHost: boolean;
  username: string | null;
  gameStarted: boolean;
  gameMode: "letters" | "numbers" | "podium" | null;
  solutions: string[] | null;
  selection: number[] | string[] | null;
  targetNum: number | null;
};

const defaultState: State = {
  roomId: null,
  socket: null,
  username: null,
  isHost: false,
  gameStarted: false,
  gameMode: null,
  solutions: null,
  selection: null,
  targetNum: null,
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
