import React, { useContext, createContext, useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";
import { ClientListenEvents, ClientEmitEvents } from "../../../common/socket";

type State = {
  roomId: string | null;
  username: string | null;
  roomUsers: string[];
  socket: Socket<ClientListenEvents, ClientEmitEvents> | null;
  isHost: boolean;
  gameStarted: boolean;
  gameMode: "letters" | "numbers" | "podium" | null;
  solutions: string[] | null;
  selection: number[] | string[] | null;
  targetNum: number | null;
};

const defaultState: State = {
  roomId: null,
  username: null,
  roomUsers: [],
  socket: null,
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

  useEffect(() => {
    const socket = io(`http://localhost:5000`, {
      transports: ["websocket", "polling", "flashsocket"],
    });
    setState({...state, socket})
  }, []);
  
  state?.socket?.on("roomUsers", (data, callback) => {
    const usernames = data.users.map(user => user.username);
    setState({...state, roomUsers: usernames})
  })

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
