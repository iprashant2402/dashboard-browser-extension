import './GridLayout.css';

const GridLayout = ({ children }: { children?: React.ReactNode }) => {
    return (
        <div className="gridLayout">
            {children}
        </div>
    )
}

export default GridLayout;