import React, { useContext, createContext, useState } from 'react';

type State = {
  roomId: string | null,
  gameStarted: boolean,
  gameMode: 'letters' | 'numbers' | 'podium' | null
};

const defaultState: State = {
  roomId: null,
  gameStarted: false,
  gameMode: null,
}

type GameContextValue = {
  state: State,
  updateState: (newState: Partial<State>) => void,
  setRoomId: (roomId: State["roomId"]) => void,
  setGameStarted: (gameStarted: State["gameStarted"]) => void,
  setGameMode: (gameMode: State['gameMode']) => void
} | null;

export const gameContext = createContext<GameContextValue>(null);

type GameContextProviderProps = {
  children: React.ReactNode
}

export const GameContextProvider = (props: GameContextProviderProps) => {
  const [state, setState] = useState<State>(defaultState);

  const value = {
    state,
    updateState: (newState: Partial<State>) => {
      setState({...state, ...newState});
    },
    setRoomId: (roomId: State["roomId"]) => {
      setState({...state, roomId});
    },
    setGameStarted: (gameStarted: State["gameStarted"]) => {
      setState({...state, gameStarted});
    },
    setGameMode: (gameMode: State["gameMode"]) => {
      setState({...state, gameMode});
    }
  };

  return <gameContext.Provider value={value}>{props.children}</gameContext.Provider>;
}

export const useGame = () => {
  const context = useContext(gameContext);

  if (context === undefined) {
    throw new Error("useContext must be used within a ContextProvider.");
  }

  return context;
}