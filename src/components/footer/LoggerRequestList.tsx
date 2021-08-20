import React, { useState, useEffect, useRef, useCallback, CSSProperties } from "react";
import Utils from "../../Utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faNetworkWired, faCodeBranch, faCode, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import "./loggerRequestList.scss";

export default function LoggerRequestList() {
    let [logEntries, setLogEntries] = useState(CiCAPI.log.listEntries()),
        [stats, setStats] = useState(CiCAPI.log.getStats()),
        [isNetworkChecked, setNetworkChecked] = useState(true),
        [isAPIChecked, setAPIChecked] = useState(true),
        [textInputFilter, setTextInputFilter] = useState(""),
        networkFilterChecked = useRef(true),
        apiFilterChecked = useRef(true),
        fetchLogEntriesFunc = useCallback(() => {
            let type: number | undefined;

            if (networkFilterChecked.current && !apiFilterChecked.current) {
                type = CiCAPI.log.constants.LOG_TYPE_ENUM.network;
            } else if (!networkFilterChecked.current && apiFilterChecked.current) {
                type = CiCAPI.log.constants.LOG_TYPE_ENUM.apiCall;
            }

            if (networkFilterChecked.current || apiFilterChecked.current) {
                setLogEntries(CiCAPI.log.listEntries(type))
            } else {
                setLogEntries([])
            }
        }, [])
        // or { isNetworkChecked: true, isAPIChecked: true }

    useEffect(() => {
        let onLogsUpdated = Utils.debounce(() => {
            fetchLogEntriesFunc();
            setStats(CiCAPI.log.getStats());
        }, 500);
        CiCAPI.log.registerToChanges(onLogsUpdated);
        return () => CiCAPI.log.unregisterToChanges(onLogsUpdated);
    }, []);

    useEffect(() => {
        fetchLogEntriesFunc()
    }, [isAPIChecked, isNetworkChecked]);

    if(textInputFilter.trim() !== "") {
        let lcFilter = textInputFilter.toLocaleLowerCase();
        logEntries = logEntries.filter((logEntry: IPublicLogEntry) => logEntry.msg.toLowerCase().includes(lcFilter));
    }

    return (
        <div className="logger-requests-list-root">
            <div className="logger-requests-globalview">
                <div className="logger-requests-avg-container">
                    <span className="logger-request-avg-label">Network Stats ({stats.network.entryCount} calls)</span>
                    <div className="logger-net-stats">
                        <div>Min: {stats.network.minTime} ms</div>
                        <div>Max: {stats.network.maxTime} ms</div>
                        <div>Avg: {Math.round(stats.network.totalEntryTime / stats.network.entryCount)} ms</div>
                    </div>
                </div>

                <div className="logger-requests-avg-container">
                    <span className="logger-request-avg-label">API Stats ({stats.api.entryCount} calls)</span>
                    <div className="logger-api-stats-graph">
                        {Object.entries(stats.api.namespace).map((entry: Array<string | IBasicStats>) => {
                            let entryStats: IBasicStats = entry[1] as IBasicStats;
                            return <GraphEntry key={entry[0] as string} namespace={entry[0] as string} percent={parseInt(((entryStats.entryCount / stats.api.entryCount) * 100).toFixed(2))} />
                        })}
                    </div>
                </div>
            </div>


            <div className="logger-request-list-container">
                <div className="logger-request-list-filter">
                    <div className="logger-request-list-type-filter">
                        <div className="logger-request-list-type-toggle">
                            <FontAwesomeIcon icon={faCodeBranch} />
                            <input type="checkbox" checked={isAPIChecked} onChange={() => { apiFilterChecked.current = !apiFilterChecked.current; setAPIChecked(!isAPIChecked); }} />
                            <span>API Calls</span>
                        </div>
                        <div className="logger-request-list-type-toggle">
                            <FontAwesomeIcon icon={faNetworkWired} />
                            <input type="checkbox" checked={isNetworkChecked} onChange={() => { networkFilterChecked.current = !networkFilterChecked.current; setNetworkChecked(!isNetworkChecked); }} />
                            <span>Network Calls</span>
                        </div>
                        <div className="logger-request-list-text-filter">
                            <span>Filter: </span>
                            <input type="text" placeholder="Filter criteria here...." value={textInputFilter} onChange={(e) => setTextInputFilter(e.target.value)} />
                        </div>
                    </div>
                </div>
                <div className="logger-request-list-header">
                    <span>Type</span>
                    <span>Time</span>
                    <span>Log</span>
                    <span className="logger-request-list-header-last">Data</span>
                </div>

                <div className="logger-requests-list">
                    {logEntries.map((logEntry: IPublicLogEntry, idx: number) => <LogEntryComponents key={logEntry.createdOn + ":" + idx} entry={logEntry} />)}
                </div>
            </div>
        </div>
    );
}

interface ILogEntryComponentProps {
    entry: IPublicLogEntry
}

//=============================================================================
function LogEntryComponents(props: ILogEntryComponentProps) {
    let icon: IconDefinition;

    if (props.entry.type === 0) {
        icon = faNetworkWired;
    } else {
        icon = faCodeBranch;
    }

    return (
        <div className="logger-request-entry">
            <span className="logger-request-entry-centered"><FontAwesomeIcon icon={icon} /></span>
            <span className="logger-request-entry-right-aligned">{Utils.millisToString(props.entry.time)}</span>
            <span className="truncatable-text">{props.entry.msg}</span>
            <span className="truncatable-text">{props.entry.data}</span>
        </div>
    );
}

interface IGraphEntry {
    namespace: string,
    percent: number
}
//=============================================================================
function GraphEntry(props: IGraphEntry) {
    let style: CSSProperties = {
        width: props.percent + "%"
    },
        barClassNames = [`logger-${props.namespace}-ns`, "logger-api-stats-graph-entry-bar"];

    return (
        <div className="logger-api-stats-graph-entry">
            <div className="logger-api-stats-graph-entry-ns">{props.namespace}</div>
            <div className="logger-api-stats-graph-entry-bar-container">
                <div className={barClassNames.join(" ")} style={style} ></div>
            </div>
        </div>
    );
}