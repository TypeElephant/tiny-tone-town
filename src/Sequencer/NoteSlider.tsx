import React, { ChangeEventHandler, FC } from "react"
import cn from "classnames"

type NoteSliderProps = {
  note: number
  idx: number
  currentStep: number
  onChangeNote: (value: number, stepIdx: number) => void
}
const NoteSlider: FC<NoteSliderProps> = ({
  note,
  idx,
  currentStep,
  onChangeNote,
}) => {
  const isCurrentNote = currentStep === idx + 1
  const noteSliderStyle = cn("p-2 bg-gray-100 transition-colors", {
    "bg-yellow-100": isCurrentNote,
  })

  const handleOnChangeNote: ChangeEventHandler<HTMLInputElement> = e => {
    onChangeNote(Number(e.target.value), idx)
  }

  return (
    <div className={noteSliderStyle} key={idx}>
      <input
        type="range"
        min="20"
        max="1200"
        value={note}
        id="note"
        onChange={handleOnChangeNote}
      />
    </div>
  )
}

export default NoteSlider
