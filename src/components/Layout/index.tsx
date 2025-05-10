import './index.css';

export const Layout = (props: { children?: React.ReactNode }) => {
    return (
        <div className="layout">
            {props.children}
        </div>
    )
}