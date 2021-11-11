import Utils from "Utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEraser } from "@fortawesome/free-solid-svg-icons"
import React, { useState, useRef, useEffect } from "react";

const
    KIBIBYTES = 1024,
    MEBIBYTE_VALUE = KIBIBYTES * KIBIBYTES;

interface ICacheControlProps {

}

//=============================================================================
export default function CacheControl(props: ICacheControlProps) {
    let [isCacheDisabled, setCacheDisabled] = useState(true),
        [isAppInsightEnabled, setAppInsightEnabled] = useState(true),
        [isDisplayingReloadMsg, setDisplayingReloadMsg] = useState(false),
        [cacheSize, setCacheSize] = useState(0),
        networkCount = useRef(CiCAPI.log.getStats().network.entryCount),
        renderedCachedData,
        pageAppInsightEnabled: React.MutableRefObject<boolean> = useRef<boolean>(true);

    useEffect(() => {
        let appInsightEnabled: boolean = CiCAPI.getConfig("appInsight.enabled") as boolean,
            onLogsChanged = Utils.debounce(() => {
                if (isCacheDisabled) {
                    let stats: ILoggerStats = CiCAPI.log.getStats();
                    if (networkCount.current !== stats.network.entryCount) {
                        networkCount.current = stats.network.entryCount;
                        setCacheSize(CiCAPI.cache.getCacheSize());
                    }
                }
            }, 500);

        pageAppInsightEnabled.current = appInsightEnabled;
        setAppInsightEnabled(appInsightEnabled);
        setCacheDisabled(!CiCAPI.cache.isCacheEnabled());
        setCacheSize(CiCAPI.cache.getCacheSize());
        // register to logger changes
        CiCAPI.log.registerToChanges(onLogsChanged);
        return () => { // cleanup on onmount
            CiCAPI.log.unregisterToChanges(onLogsChanged);
        }
    }, []);


    function handleCacheToggle(e: React.ChangeEvent<HTMLInputElement>) {
        let isCacheDisabled = e.target.checked;
        setCacheDisabled(isCacheDisabled);
        CiCAPI.cache.setCacheEnabled(!isCacheDisabled);
    }

    function handleAppInsightToggle(e: React.ChangeEvent<HTMLInputElement>) {
        let isEnabled: boolean = e.target.checked;

        if (pageAppInsightEnabled.current !== isEnabled) {
            setDisplayingReloadMsg(true);
        }
        setAppInsightEnabled(isEnabled);
        CiCAPI.setConfig("appInsight.enabled", isEnabled);
    }

    if (!isCacheDisabled) {
        renderedCachedData = (<CachedData size={cacheSize} />);
    }

    // appInsight.enabled

    return (
        <div className="footer-cache-control centered-flex">
            <div className="centered-flex">
                <input id="enable-cache-toggle" type="checkbox" checked={isCacheDisabled} onChange={handleCacheToggle} />
                <label htmlFor="enable-cache-toggle">Disable Cache</label>
            </div>

            <div className="centered-flex reload-msg-container">
                {isDisplayingReloadMsg && <div className="reload-msg" onAnimationEnd={() => setDisplayingReloadMsg(false)}>Please Reload Page</div>}
                <input id="appinsight-toggle" type="checkbox" checked={isAppInsightEnabled} onChange={handleAppInsightToggle} />
                <label htmlFor="appinsight-toggle">Enable App Insight</label>
            </div>

            {renderedCachedData}
        </div>
    );
}

interface ICacheDataProps {
    size: number
}

//=============================================================================
function CachedData(props: ICacheDataProps) {
    let [, updateState] = useState(),
        cacheSize: number,
        cacheSizeLabel: string;

    function handleClick() {
        CiCAPI.cache.clearCache();
        updateState({} as any); // equivalent of force update
    }

    cacheSize = props.size;
    if (cacheSize < 1024) {
        // bytes
        cacheSizeLabel = `${cacheSize} Bytes`;
    } else if (cacheSize < MEBIBYTE_VALUE) {
        // kilobytes
        cacheSizeLabel = `${Math.round((cacheSize / KIBIBYTES) * 100) / 100} KiB`;
    } else {
        // megabytes
        cacheSizeLabel = `${Math.round((cacheSize / MEBIBYTE_VALUE) * 100) / 100} MiB`;
    }

    return (
        <div className="centered-flex">
            <span className="footer-label">Nb requests cached:</span>
            <span>{CiCAPI.cache.getNbCachedEntries()}</span>
            <span className="footer-label">cache size:</span>
            <span>{cacheSizeLabel}</span>
            <button className="cache-control-clear-btn" title="Clear Cache" onClick={handleClick}><FontAwesomeIcon icon={faEraser} /></button>
        </div>
    )
}