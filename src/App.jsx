import React from "react";
import Die from "./components/Die"
import Header from "./components/Header"
import { nanoid } from "nanoid"
import Confetti from 'react-confetti'

const RECORD_LOCAL_KEY = "tenzies.bumble.record"
const VIEW_LOCAL_KEY = "tenzies.bumble.view"

function App() {
  const [dice, setDice] = React.useState(allNewDice())
  const [tenzies, setTenzies] = React.useState(false)
  const [time, setTime] = React.useState({
    startTime: 0,
    finishTime: 0,
    isBegun: false
  })
  const [rolls, setRolls] = React.useState(0)
  const [record, setRecord] = React.useState(
    JSON.parse(localStorage.getItem(RECORD_LOCAL_KEY)) || ""
  )
  const [view, setView] = React.useState(
    JSON.parse(localStorage.getItem(VIEW_LOCAL_KEY)) || { diceView: "numbers", color: "black" }
  )

  React.useEffect(() => {
    const dieNumber = dice[0].value
    if (dice.every(die => (die.value === dieNumber && die.isHeld === true))) {
      setTenzies(true)
      setTime(prevTime => ({
        ...prevTime,
        finishTime: Date.now()
      }))
    }
  }, [dice])
  React.useEffect(() => {
    localStorage.setItem(VIEW_LOCAL_KEY, JSON.stringify(view))
  }, [view])

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
    if (!time.isBegun) {
      setTime({
        startTime: Date.now(),
        finishTime: 0,
        isBegun: true
      })
    }
  }

  const diceElements = dice.map(die => (
    <Die
      key={die.id}
      value={die.value}
      view={view}
      isHeld={die.isHeld}
      handleClick={() => holdDice(die.id)}
    />
  ))

  function roll() {
    if (tenzies) {
      setDice(allNewDice())
      setTenzies(false)
      setTime(Date.now())
      setRolls(0)
      setTime({
        startTime: 0,
        finishTime: 0,
        isBegun: false
      })
    } else {
      if (!time.isBegun) {
        setTime({
          startTime: Date.now(),
          finishTime: 0,
          isBegun: true
        })
      }
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
    const duration = (time.finishTime - time.startTime) / 1000
    checkRecord(duration)

    return formatTime(duration)
  }

  const style = tenzies ? { marginRight: "auto" } : {}

  return (
    <>
      <header>
        <Header
          view={view}
          setView={setView}
        />
      </header>
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
    </>
  )
}

export default App