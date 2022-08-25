import React from "react";
import Die from "./components/Die"
import { nanoid } from "nanoid"
import Confetti from 'react-confetti'

const RECORD_LOCAL_KEY = "tenzies.bumble.record"

function App() {
  const [dice, setDice] = React.useState(allNewDice())
  const [tenzies, setTenzies] = React.useState(false)
  const [startTime, setStartTime] = React.useState(Date.now())
  const [rolls, setRolls] = React.useState(0)
  const [record, setRecord] = React.useState(
    JSON.parse(localStorage.getItem(RECORD_LOCAL_KEY)) || ""
  )

  React.useEffect(() => {
    const dieNumber = dice[0].value
    if (dice.every(die => (die.value === dieNumber && die.isHeld === true))) {
      setTenzies(true)
    }
  }, [dice])

  function allNewDice() {
    const newDice = []
    for (let i = 0; i < 10; i++) {
      newDice.push({
        value: Math.ceil(Math.random() * 6),
        isHeld: false,
        id: nanoid()
      })
    }
    return newDice
  }

  function holdDice(id) {
    if (!tenzies)
      setDice(prevDice => prevDice.map(die => {
        if (die.id === id)
          return { ...die, isHeld: !die.isHeld }
        else
          return die
      }))
  }

  const diceElements = dice.map(die => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      handleClick={() => holdDice(die.id)}
    />
  ))

  function roll() {
    if (tenzies) {
      setDice(allNewDice())
      setTenzies(false)
      setStartTime(Date.now())
      setRolls(0)
    } else {
      setDice(prevDice => prevDice.map(die => {
        if (die.isHeld) return die
        else return { ...die, value: Math.ceil(Math.random() * 6) }
      }))
      setRolls(prevRolls => prevRolls + 1)
    }
  }

  function checkRecord(time) {
    if (record === "") {
      setRecord(time)
      localStorage.setItem(RECORD_LOCAL_KEY, JSON.stringify(time))
    }
    else if (time < record) {
      setRecord(time)
      localStorage.setItem(RECORD_LOCAL_KEY, JSON.stringify(time))
    }
  }

  function formatTime(timer) {
    const minutes = parseInt(timer / 60, 10)
    const seconds = parseFloat(timer % 60).toFixed(1)

    return `${minutes < 10 ? "0" + minutes : minutes} : ${seconds < 10 ? "0" + seconds : seconds}`
  }

  function calcTime() {
    const duration = (Date.now() - startTime) / 1000
    checkRecord(duration)

    return formatTime(duration)
  }

  const style = tenzies ? { marginRight: "auto" } : {}

  return (
    <main className="App">
      <p className="game-title">Tenzies</p>
      <p className="game-instructions">
        Roll until all dice are the same. Click each die to freeze it at its current value between rolls.
      </p>
      <div className="dice-container">
        {diceElements}
      </div>
      <div className="extras">
        <button
          type="button"
          className="roll-btn"
          onClick={roll}
          style={style}
        >
          {tenzies ? "New Game" : "Roll"}
        </button>
        {tenzies &&
          <div className="extra-div">
            <span className="card-title">Rolls</span>
            <span className="card-value">{rolls}</span>
          </div>}
      </div>
      {tenzies &&
      <div className="time">
          <div className="extra-div">
            <span className="card-title">Time</span>
            <span className="card-value">{calcTime()}</span>
          </div>
          <div className="extra-div">
            <span className="card-title">Record</span>
            <span className="card-value">{formatTime(parseFloat(record).toFixed(1))}</span>
          </div>
      </div>}
      {tenzies && <Confetti />}
    </main>
  )
}

export default App