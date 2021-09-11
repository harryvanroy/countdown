import React, { useState } from 'react'
import { useGame } from '../context/game'

const Chat = () => {
  const game = useGame();
  const [messages, setMessages] = useState<{username: string, message: string}[]>([])
  const [message, setMessage] = useState("")

  const socket = game?.state?.socket;

  socket?.on("chatMessage", (data, callback) => {
    setMessages([...messages, data])
  })

  const onSendMessage = (e: any) => {
    // if enter key pressed
    if (e.keyCode === 13) {
      socket?.emit("chatMessage", message, () => {
        setMessage("")
      })
    }
  }

  return (
    <>
      <ul>
        {messages.map(({username, message}, index) => {
          const align = username === game?.state?.username 
            ? "right" : "left";

          return (
            <li key={index} style={{textAlign: align}}>
              <b>{username}:</b> {message}
            </li>
          )
        })}
      </ul>
      <input type="text" placeholder={"Chat here"} onChange={(e) => setMessage(e.target.value)}
        onKeyDown={onSendMessage}/>
    </>
  )
}

export default Chat