interface User {
  id: number;
  username: string;
  room: string;
}

const users: User[] = [];

// Join user to chat
export const userJoin = (id: number, username: string, room: string) => {
  const user = { id, username, room };

  users.push(user);

  return user;
};

export const getCurrentUser = (id: number) => {
  return users.find((user) => user.id === id);
};

export const userLeave = (id: number) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

export const getRoomUsers = (room: string) => {
  return users.filter((user) => user.room === room);
};
