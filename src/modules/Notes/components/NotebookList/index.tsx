import "./index.css";
import { getRandomQuote } from "../../../../utils/quotes";
import { useMemo, useState } from "react";
import { Button } from "../../../../components/Button";
import { IoAddCircle } from "react-icons/io5";
import { Dialog } from "../../../../components/Dialog";

export const NotebookList = () => {
    const quote = useMemo(() => getRandomQuote(), []);
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className="notebook-list">
                <div className="row jt-space-between ai-center">
                    <div>
                        <h1 className="notebook-list-title">Your <span>Pages</span></h1>
                        <p className="notebook-list-description">{quote}</p>
                    </div>
                    <div>
                        <Button
                            variant="clear"
                            icon={<IoAddCircle size={24} />}
                            onClick={() => setIsOpen(true)}
                        />
                    </div>
                </div>
            </div>
            <Dialog
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="Create a new notebook"
            >
                <p>This is the dialog content.</p>
            </Dialog>
        </>
    )
}