interface User {
  id: string;
  username: string;
  room: string;
  isHost: boolean;
}

export const users: User[] = [];

export const addUser = (
  id: string,
  username: string,
  room: string,
  isHost: boolean
): User | undefined => {
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const existingUser = users.find(
    (user) => user.room === room && user.username === username
  );
  if (existingUser) {
    return;
  }

  const user = { id, username, room, isHost };
  users.push(user);

  return user;
};

export const removeUser = (id: string): User | undefined => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

export const getUser = (id: string): User | undefined =>
  users.find((user) => user.id === id);

export const getUsersInRoom = (room: string): User[] =>
  users.filter((user) => user.room === room);
