interface User {
  username: string;
  roomID: string;
  isHost: boolean;
}

interface Room {
  status: "letters" | "numbers";
  selections: string[] | number[];
  solutions: string[];
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
