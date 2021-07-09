import React from "react";
import { LogType } from "./LogEntry";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLongArrowAltLeft, faLongArrowAltRight, IconDefinition } from '@fortawesome/free-solid-svg-icons';

interface ILogSource {
    type: LogType
}

//=============================================================================
export default function LogSource(props: ILogSource) {
    let logClass: string,
        arrowIcon: IconDefinition;

    if (props.type === LogType.PCSCallback) {
        logClass = "pcscallback-log-entry";
    } else {
        logClass = "pcs-log-entry";
    }

    if (props.type === LogType.PCS) {
        arrowIcon = faLongArrowAltRight;
    } else {
        arrowIcon = faLongArrowAltLeft;
    }

    return (
        <div className={["log-entry-src", logClass].join(" ")}>
            <span>Host</span>
            <FontAwesomeIcon icon={arrowIcon} />
            <span>PCS</span>
        </div>
    );
}