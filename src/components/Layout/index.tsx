import './index.css';

export const Layout = (props: { children?: React.ReactNode, className?: string }) => {
    return (
        <div className={props.className ? `layout ${props.className}` : 'layout'}>
            {props.children}
        </div>
    )
}