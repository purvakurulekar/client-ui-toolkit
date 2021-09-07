import React, { useState, useEffect, useCallback } from "react";
import Utils from "../../Utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookDead, faEraser } from "@fortawesome/free-solid-svg-icons";

interface IRequestTimingPreviewProps {
    onFullRequestClicked: Function
}

export default function RequestTimingPreview(props: IRequestTimingPreviewProps) {
    let [stats, setStats] = useState(CiCAPI.log.getStats()),
        lastLogEntry: IPublicLogEntry | void = CiCAPI.log.listEntries(CiCAPI.log.constants.LOG_TYPE_ENUM.network, 1, 0)[0],
        lastLogTime: string,
        avgTiming: IAvgTimings;

    avgTiming = {
        min: stats.network.minTime,
        max: stats.network.maxTime,
        avg: Math.round(stats.network.totalEntryTime / stats.network.entryCount)
    };

    if (lastLogEntry) {
        lastLogTime = Utils.millisToString(lastLogEntry.time);
    } else {
        lastLogTime = " -- ";
    }

    useEffect(() => {
        let onLogsChanged = Utils.debounce(() => {
            console.log("RequestTimingPreview Logs Changed");
            setStats(CiCAPI.log.getStats());
        }, 500);

        // register to logger changes
        CiCAPI.log.registerToChanges(onLogsChanged);
        return () => { // cleanup on onmount
            CiCAPI.log.unregisterToChanges(onLogsChanged);
        }
    }, []);

    return (
        <div className="footer-timings centered-flex">
            <span className="footer-label">Requests Timing: </span>
            <div className="centered-flex">
                <span className="footer-label">nb requests:</span>
                <span>{stats.network.entryCount}</span>
                <span className="footer-label">last request: </span>
                <span>{Utils.millisToString(lastLogEntry && lastLogEntry.time || 0)}</span>
                <span className="footer-label">avg: </span>
                {stats.network.entryCount > 0 && <span>{Utils.millisToString(avgTiming.min)} / {Utils.millisToString(avgTiming.avg)} / {Utils.millisToString(avgTiming.max)}</span>}
                {stats.network.entryCount === 0 && <span> -- / -- / --</span>}
                <button className="request-full-timings-btn" onClick={() => props.onFullRequestClicked()}><FontAwesomeIcon icon={faBookDead} /></button>
                <button className="request-timings-clear-btn" title="Clear Timings" onClick={() => CiCAPI.log.reset()}><FontAwesomeIcon icon={faEraser} /></button>
            </div>
        </div>
    );
}