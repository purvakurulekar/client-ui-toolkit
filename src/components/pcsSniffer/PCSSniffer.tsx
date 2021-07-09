import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faEraser } from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import LogViewer from "./LogViewer";
import { ILog } from "./LogEntry";
import "./pcsSniffer.scss";

export default function PCSSniffer() {
    let [isExpanded, setExpanded] = useState(false),
        [logs, setLogs] = useState([]),
        icon: IconDefinition,
        style: object;

    useEffect(() => {
        let onLogsChanged = (pcsLogs: Array<ILog>) => {
            setLogs([].concat(pcsLogs as []));
        };

        // @ts-ignore
        if (window.pcsStubBridge) {
            // @ts-ignore
            setLogs(window.pcsStubBridge.getLogEntries());
            // @ts-ignore
            window.pcsStubBridge.registerOnLogsChanged(onLogsChanged);
        }

        return () => {
            console.log("Detaching from PCS / PCSCallback");
            // @ts-ignore
            if (window.pcsStubBridge) {
                // @ts-ignore
                window.pcsStubBridge.unregisterOnLogsChanged(onLogsChanged);
            }
        };
    }, []);

    // height: 100%;

    if (isExpanded) {
        icon = faMinus;
        style = {
            height: "100%"
        };
    } else {
        icon = faPlus;
    }

    return (
        <div className="pcs-sniffer-root" style={style}>
            <div className="pcs-sniffer-header">
                <img src="assets/images/sniffing-dog.png" />
                <span className="pcs-sniffer-title">PCS Sniffer</span>
                {isExpanded && <button onClick={() => {
                    // @ts-ignore 
                    window.pcsStubBridge.clearLogs()
                }} title="clear"><FontAwesomeIcon icon={faEraser} /></button>}
                <button onClick={() => setExpanded(!isExpanded)}><FontAwesomeIcon icon={icon} /></button>
            </div>
            {isExpanded && <LogViewer logs={logs as Array<ILog>} />}
        </div>
    );
}