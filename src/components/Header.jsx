export default function Header(props) {
    return (
            <nav>
                <button
                    type="button"
                    onClick={props.handleClick}
                >
                    {props.view.diceView === "dice" ? "Dice View" : "Number View"}
                </button>
            </nav>
    )
}