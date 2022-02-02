import React, { FC, useState } from "react"

import Sequencer from "./Sequencer"

import "./index.css"

const App: FC = () => {
  const [entered, setEntered] = useState(false)

  const handleOnClickEnter = (): void => {
    setEntered(true)
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full space-y-2">
      {entered ? (
        <Sequencer />
      ) : (
        <button className="button-1" onClick={handleOnClickEnter}>
          Enter tiny tone town
        </button>
      )}
    </div>
  )
}

export default App
