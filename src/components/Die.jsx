import React from "react";

export default function Die(props) {
    let numberClassName, hamada = 1
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

    return (
        <div
            className={`die ${props.isHeld && "held"} ${numberClassName}`}
            onClick={props.handleClick}
        >
        </div>
    )
}