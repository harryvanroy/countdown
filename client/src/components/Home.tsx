import React from 'react';
import { useGame } from '../context/game';
import { makeNewRoom } from '../api'

const Home = () => {
  const game = useGame();

  const onCreateRoom = (_: any) => {
    try {
      const roomId = makeNewRoom();
      game?.setRoomId(roomId);
    } catch (e: any) {
      // TODO
      alert(e?.message)
    }
  }

  const onJoinRoom = (_: any) => {

  }

  return (
    <>
      <h1>{game?.state.roomId}</h1>
      <button onClick={onCreateRoom}>Create room</button>
      <button>Join room</button>
    </>
  );
};

export default Home;
