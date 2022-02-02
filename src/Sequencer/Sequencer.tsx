import React, {
  ChangeEventHandler,
  FC,
  useEffect,
  useMemo,
  useState,
} from "react"
import cn from "classnames"
import * as Tone from "tone"

import NoteSlider from "./NoteSlider"

const DEFAULT_INTERVAL_TIME = 200
const DEFAULT_NOTE = 440
const NUMBER_OF_STEPS = 16

const Sequencer: FC = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [step, setStep] = useState(1)
  const [intervalTime, setIntervalTime] = useState(DEFAULT_INTERVAL_TIME)

  const initialNotes = Array.from(Array(NUMBER_OF_STEPS)).fill(DEFAULT_NOTE)
  const [notes, setNotes] = useState<number[]>(initialNotes)

  const reverb = useMemo(() => new Tone.Reverb(3).toDestination(), [])
  const synthA = useMemo(
    () => new Tone.FMSynth({ portamento: 0 }).toDestination().connect(reverb),
    [reverb],
  )

  useEffect(() => {
    let interval: NodeJS.Timer | undefined

    if (interval === undefined && isPlaying) {
      interval = setInterval(() => {
        synthA.triggerAttackRelease(notes[step - 1], "8hz", Tone.now())
        setStep(prevStep => {
          if (prevStep < NUMBER_OF_STEPS) {
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
  }, [notes, synthA, step, isPlaying, intervalTime])

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

  const handleOnChangeNote = (value: number, idx: number): void => {
    const nextNotes = [...notes]
    nextNotes[idx] = value
    setNotes(nextNotes)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <input
          type="range"
          min="100"
          max="800"
          value={intervalTime}
          id="note"
          onChange={handleOnChangeIntervalTime}
        />
        <button className={buttonStyle} onClick={handleOnClickStartStop}>
          {buttonText(isPlaying)}
        </button>
      </div>

      <div className="flex flex-col space-y-2">
        {notes.map((note, idx) => {
          return (
            <NoteSlider
              note={note}
              idx={idx}
              currentStep={step}
              onChangeNote={handleOnChangeNote}
              key={idx}
            />
          )
        })}
      </div>
    </div>
  )
}

export default Sequencer
