import './Icon.css';

export const Icon = (props: { name: string }) => {
    return (
        <img src={`/icons/${props.name}.svg`} alt={props.name} />
    )
}