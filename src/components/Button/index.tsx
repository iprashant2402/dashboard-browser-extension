import { ButtonHTMLAttributes, ReactNode } from "react";
import "./index.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    label?: ReactNode;
    icon?: ReactNode;
    onClick?: () => void;
    variant: 'primary' | 'secondary' | 'clear' | 'outline';
    className?: string;
}

export const Button = ({label, icon, variant, className, ...props}: ButtonProps) => {
    return <button className={`button ${variant} ${className}`} {...props} >
        {icon && icon}
        {label && <span className="button-label">{label}</span>}
    </button>;
}