import React from 'react'

export const isEnterKey = (e: React.KeyboardEvent) => {
  return e.keyCode === 13;
}