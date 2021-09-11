import React from 'react';
import { useHistory } from 'react-router-dom';

const Home = () => {
  const history = useHistory();

  const onCreateRoom = (e: any) => {
    const roomId = (Math.random() + 1).toString(36).substring(7);
    history.push(roomId);
  }

  const onJoinRoom = (e: any) => {

  }

  return (
    <>
      <h1>Home</h1>
      <button onClick={onCreateRoom}>Create room</button>
      <button>Join room</button>
    </>
  )
}

export default Home