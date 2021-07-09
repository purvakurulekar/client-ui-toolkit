import React from "react";
import './loader.scss';

interface LoaderProps {
    width?:number,
    height?:number
}

export default function Loader(props: LoaderProps) {
    let style = {
        width: props.width || 30,
        height: props.height || 14
    };
    
    return (
        <div className="loader" style={style}>
            <div className="loader-bar loader-bar1"></div>
            <div className="loader-bar loader-bar2"></div>
            <div className="loader-bar loader-bar3"></div>
        </div>
    );
}