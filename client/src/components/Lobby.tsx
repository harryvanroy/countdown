import React from "react";

export type LobbyProps = {
  roomId: string;
};

const Lobby = (props: LobbyProps) => {
  return (
    <>
      <h1>Lobby</h1>
      <h2>{props.roomId}</h2>
    </>
  );
};

export default Lobby;
