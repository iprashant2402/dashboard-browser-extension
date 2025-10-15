import IconErrorSvg from './IconError.svg?react';

export const IconError = (props: { color?: string; size?: number }) => {
    return <IconErrorSvg fill={props.color} width={props.size} height={props.size} />;
}