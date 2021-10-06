import React, { useState } from "react";
import "./footer.scss";
import SettingsPanel from "./SettingsPanel";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import CacheControl from "./CacheControl";
import RequestTimingPreview from "./RequestTimingPreview";

import { Dashboard } from "client-test-dashboard";

// import LoggerRequestList from "./LoggerRequestList";
// now it's the dashboard lib

interface IFooterProps {
    // dataSources: Array<string>,
    // onDataSourcesChanged: Function
    onSettingsToggled: Function
}

export default function Footer(props: IFooterProps) {
    let [isFullRequestVisible, setFullRequestsVisible] = useState(false),
        [isShowingSettings, setShowSettings] = useState(false),
        settingsClassNames = ["settings-btn"];

    if (isShowingSettings) {
        settingsClassNames.push("settings-btn-active");
    }

    function handleFullRequestsClicked() {
        console.log("Full Request Clicked!");
        setFullRequestsVisible(!isFullRequestVisible);
    }

    function handleSettingsClicked() {
        console.log("Settings Clicked!");
        setShowSettings(!isShowingSettings);
        props.onSettingsToggled(!isShowingSettings);
    }

    return (
        <footer className="footer">
            <CacheControl />
            <RequestTimingPreview onFullRequestClicked={handleFullRequestsClicked} />
            <button className={settingsClassNames.join(" ")} onClick={handleSettingsClicked}><FontAwesomeIcon icon={faCog} /></button>
            {isFullRequestVisible && <Dashboard />}
            {isShowingSettings && <SettingsPanel onClose={handleSettingsClicked} />}
        </footer>
    );
}

