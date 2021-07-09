import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import ArgRow from "./ArgRow";

interface IArgsPreview {
    args: Array<any>,
    onClose: Function
}

//=============================================================================
export default function ArgsPreview(props: IArgsPreview) {
    return (
        <div className="args-preview">
            {props.args.length > 0 && props.args.map((arg: string|number, idx: number) => <ArgRow key={`arg-${idx}`} index={idx} arg={arg} />)}
            {props.args.length === 0 && <div className="args-preview-empty">No Arguments</div>}
            <button onClick={() => props.onClose()}><FontAwesomeIcon icon={faTimesCircle} /></button>
        </div>
    );
}