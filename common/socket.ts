// what server sends to clients
export type ServerSideEvents = {
  message: (data: string, callback: any) => void;
  roomUsers: (data: { users: User[] }, callback: any) => void;
  startGame: (
    data:
      | {
          mode: "letters";
          selection: string[];
          solutions: string[];
        }
      | {
          mode: "numbers";
          selection: number[];
          target: number;
          solutions: string[];
        },
    callback: any
  ) => void;
};

// what clients send to server
export type ClientEmitEvents = {
  message: (data: string, callback: any) => void;
  createRoom: (
    data: {
      username: string;
    },
    callback: any
  ) => void;
  joinRoom: (
    data: {
      username: string;
      room: string;
    },
    callback: any
  ) => void;
  startGame: (
    data: {
      mode: string;
    },
    callback: any
  ) => void;
};

// what client receives from server
export type ClientListenEvents = ServerSideEvents;

// what server receives from client
export type ServerListenEvents = ClientEmitEvents;

// not actually used by server.emit!!
export type ServerEmitEvents = {
  [key: string]: (...args: any[]) => void;
};

export interface User {
  username: string;
  roomID: string;
  isHost: boolean;
}
