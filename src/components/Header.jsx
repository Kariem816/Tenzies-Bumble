import React from "react"

const VIEW_LOCAL_KEY = "tenzies.bumble.view"

export default function Header(props) {
    const [view, setView] = React.useState(props.view)

    React.useEffect(() => {
        props.setView(view)
        localStorage.setItem(VIEW_LOCAL_KEY, JSON.stringify(view))
    }, [view])

    function handleChange(e) {
        const { name, value, type, checked } = e.target

        setView(prevView => {
            return {
                ...prevView,
                [name]: type === "checkbox" ? checked : value
            }
        })
    }

    function handleClick() {
        setView(prevView => ({
            ...prevView,
            diceView: prevView.diceView === "dice" ? "numbers" : "dice"
        }))
    }

    return (
            <nav>
                <button
                    type="button"
                    onClick={handleClick}
                >
                    {props.view.diceView === "dice" ? "Dice View" : "Number View"}
                </button>

                <select
                name="color"
                id="color-select"
                value={view.color}
                onChange={handleChange}
                >
                    <option value="black">black</option>
                    <option value="light-red">red</option>
                    <option value="orange">orange</option>
                    <option value="yellow">yellow</option>
                    <option value="light-green">green</option>
                    <option value="lime">lime</option>
                    <option value="cyan">cyan</option>
                    <option value="pink">pink</option>
                </select>
            </nav>
    )
}