interface User {
  username: string;
  roomID: string;
  isHost: boolean;
}

interface Room {
  gameStarted: boolean;
  gameMode: "letters" | "numbers" | "podium" | null;
  solutions: string[] | null;
  selection: number[] | string | null;
  targetNum: number | null;
  leaderboard: {
    [username: string]: {
      score?: number;
      guess?: string | number;
      delta?: number;
    };
  };
  totalScores: Record<string, number>;
}

export const rooms: Record<string, Room> = {};
export const users: Record<string, User> = {};

export const addUser = (
  id: string,
  username: string,
  roomID: string,
  isHost: boolean
): User | undefined => {
  username = username.trim().toLowerCase();
  roomID = roomID.trim().toLowerCase();

  let existingUser = false;
  for (const userID in users) {
    if (
      users[userID].roomID === roomID &&
      users[userID].username === username
    ) {
      existingUser = true;
    }
  }
  if (existingUser) {
    return;
  }

  const user = { username, roomID, isHost };
  users[id] = user;

  return user;
};

export const removeUser = (id: string): User => {
  const user = users[id];

  delete users[id];
  return user;
};

export const getUser = (id: string): User => users[id];

export const getUsersInRoom = (roomId: string): User[] => {
  const usersInRoom: User[] = [];
  for (const userID in users) {
    if (users[userID].roomID === roomId) {
      usersInRoom.push(users[userID]);
    }
  }
  return usersInRoom;
};

export const addRoom = (id: string, room: Room): void => {
  rooms[id] = room;
  for (const a of getUsersInRoom(id)) {
    if (room.totalScores[a.username] === undefined) {
      room.totalScores[a.username] = 0;
    }
  }
};

export const getRoom = (id: string): Room => {
  return rooms[id];
};
