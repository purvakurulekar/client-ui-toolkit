import React from "react";
import LogEntry, { ILog } from "./LogEntry";

interface ILogViewerProps {
    logs: Array<ILog>
}

export default function LogViewer(props: ILogViewerProps) {
    return (
        <div className="log-viewer-root">
            {props.logs.length === 0 && <div className="log-viewer-empty">No Logs Collected.</div>}
            {props.logs.map((log: ILog, idx: number) => <LogEntry key={idx + log.tstamp} log={log} />)}
        </div>
    );
}