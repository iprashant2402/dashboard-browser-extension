import "./index.css";
import { getRandomQuote } from "../../utils/quotes";
export const NotebookList = () => {
    return (
        <div className="notebook-list">
            <h1 className="notebook-list-title">Your <span>Pages</span></h1>
            <p className="notebook-list-description">{getRandomQuote()}</p>
        </div>
    )
}