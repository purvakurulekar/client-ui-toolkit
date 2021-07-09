import React from "react";
import "./overlay.scss";

//=============================================================================
interface IOverlayProps {
    children?: any
}

//=============================================================================
export default function Overlay(props: IOverlayProps) {
    function handleClick(e:React.MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
    }
    
    return (
        <div className="overlay" onClick={handleClick}>
            {props.children}
        </div>
    );
}