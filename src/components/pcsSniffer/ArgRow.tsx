import React from "react";

interface IArgRow {
    index: number,
    arg: any
}

//=============================================================================
export default function ArgRow(props: IArgRow) {
    let argValue: string,
        valueClassNames: Array<string> = ["arg-value"];

    if(typeof(props.arg) === "function") {
        argValue = props.arg.toString();
        valueClassNames.push("arg-function");
    } else {
        argValue = JSON.stringify(props.arg, null, "\t");
    }

    return (
        <div className="arg-row">
            <div className="arg-index">{props.index}</div>
            <pre className={valueClassNames.join(" ")}>{argValue}</pre>
        </div>
    );
}