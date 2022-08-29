import React from "react";

export default function Die(props) {
    let numberClassName
    switch (props.value) {
        case 1:
            numberClassName = "one"
            break
        case 2:
            numberClassName = "two"
            break
        case 3:
            numberClassName = "three"
            break
        case 4:
            numberClassName = "four"
            break
        case 5:
            numberClassName = "five"
            break
        case 6:
            numberClassName = "six"
            break
    }

    const style = {
        color: props.view.color === "black" && props.isHeld ? "#a5a0a0" : ""
    }

    return (
        <div
            className={`die ${props.isHeld && props.view.color} ${props.view.diceView === "dice" && numberClassName}`}
            onClick={props.handleClick}
            style={style}
        >
            {props.view.diceView === "numbers" && props.value}
        </div>
    )
}