import React, {
  ChangeEventHandler,
  FC,
  useEffect,
  useMemo,
  useState,
} from "react"
import cn from "classnames"
import * as Tone from "tone"

import "./index.css"

const DEFAULT_INTERVAL_TIME = 200
const DEFAULT_NOTE = 440

const App: FC = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [step, setStep] = useState(1)
  const [intervalTime, setIntervalTime] = useState(DEFAULT_INTERVAL_TIME)

  const initialNotes = Array.from(Array(9)).fill(DEFAULT_NOTE)
  const [notes, setNotes] = useState<number[]>(initialNotes)

  const synthA = useMemo(
    () => new Tone.FMSynth({ portamento: 0.02 }).toDestination(),
    [],
  )
  const reverb = useMemo(() => new Tone.Reverb(5).toDestination(), [])

  useEffect(() => {
    synthA.connect(reverb)
  }, [synthA, reverb])

  useEffect(() => {
    let interval: NodeJS.Timer | undefined

    if (interval === undefined && isPlaying) {
      interval = setInterval(() => {
        setStep(prevStep => {
          if (prevStep < 8) {
            return prevStep + 1
          } else {
            return 1
          }
        })
      }, intervalTime)
    }

    return () => {
      clearInterval(Number(interval))
    }
  }, [isPlaying, intervalTime])

  useEffect(() => {
    const playNote = (step_: number): void => {
      synthA.triggerAttackRelease(notes[step_], "8hz")
    }

    if (isPlaying) {
      playNote(step)
    }
  }, [isPlaying, step, notes, synthA])

  const handleOnClickStartStop = (): void => {
    setIsPlaying(prev => !prev)
  }

  const buttonText = (isPlaying_: boolean): string => {
    switch (isPlaying_) {
      case false:
        return "Start"
      case true:
        return "Stop"
    }
  }
  const buttonColorStyle = (isPlaying_: boolean): string => {
    switch (isPlaying_) {
      case false:
        return "bg-green-600 hover:bg-green-700"
      case true:
        return "bg-red-600 hover:bg-red-700"
    }
  }
  const buttonStyle = cn("button-1", buttonColorStyle(isPlaying))

  const handleOnChangeIntervalTime: ChangeEventHandler<
    HTMLInputElement
  > = e => {
    setIntervalTime(Number(e.target.value))
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full space-y-2">
      <input
        type="range"
        min="100"
        max="800"
        value={intervalTime}
        id="note"
        onChange={handleOnChangeIntervalTime}
      />
      {notes.map((note, idx) => {
        const handleOnChangeNote: ChangeEventHandler<HTMLInputElement> = e => {
          const nextNotes = [...notes]
          nextNotes[idx] = Number(e.target.value)
          setNotes(nextNotes)
        }

        return (
          <input
            type="range"
            min="20"
            max="1200"
            value={note}
            id="note"
            key={idx}
            onChange={handleOnChangeNote}
          />
        )
      })}
      <button className={buttonStyle} onClick={handleOnClickStartStop}>
        {buttonText(isPlaying)}
      </button>
    </div>
  )
}

export default App
