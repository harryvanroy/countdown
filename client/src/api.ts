
const ENDPOINT = "";

export const makeNewRoom = (): string => {
  const roomId = (Math.random() + 1).toString(36).substring(7)
  return roomId;
}


