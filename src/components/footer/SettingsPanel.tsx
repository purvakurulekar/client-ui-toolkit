import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWindowClose } from "@fortawesome/free-regular-svg-icons";

interface ISettingsPanelProps {
    onClose: Function
}

interface ISettingsPanelGroupProps {
    label: string,
    configPath: string,
    configMap: ConfigMap
}

interface ISettingsEntryProps {
    label: string,
    path: string,
    value: string,
    onChange: Function
}

type configEntry = Array<string | number | boolean | void>;

//=============================================================================
export default function SettingsPanel(props: ISettingsPanelProps) {
    let [cic3Config, setCiC3Config] = useState(new Map(CiCAPI.getConfig("contentPlatform") as ConfigMap)),
        [viewer3dConfig, setViewer3dConfig] = useState(new Map(CiCAPI.getConfig("viewer3d") as ConfigMap));

    async function handleResetConfigs() {
        await CiCAPI.resetConfigs(void (0), true);
        setCiC3Config(new Map(CiCAPI.getConfig("contentPlatform") as ConfigMap));
        setViewer3dConfig(new Map(CiCAPI.getConfig("viewer3d") as ConfigMap));
    }

    async function handleApplyConfigs() {
        let contentPlatformConfigObj: IContentPlatformConfig,
            viewer3dConfigObj: IViewer3DConfig;

        contentPlatformConfigObj = Object.assign({}, ...Array.from(cic3Config.keys()).map((key: string) => { return { [key]: cic3Config.get(key) } }));
        viewer3dConfigObj = Object.assign({}, ...Array.from(viewer3dConfig.keys()).map((key: string) => { return { [key]: viewer3dConfig.get(key) } }));

        CiCAPI.resetConfigs({
            version: CiCAPI.getConfig("version") as number,
            contentPlatform: contentPlatformConfigObj,
            viewer3d: viewer3dConfigObj
        });

        props.onClose();
    }

    return (
        <div className="settings-panel">
            <div className="settings-panel-label">
                <span>Settings</span>
            </div>
            <button className="settings-panel-close-btn" onClick={() => props.onClose()}><FontAwesomeIcon icon={faWindowClose} /></button>
            <div className="settings-panel-content">
                <SettingsPanelGroup label="ContentPlatform" configPath="contentPlatform" configMap={cic3Config} />
                <SettingsPanelGroup label="Viewer3D" configPath="viewer3d" configMap={viewer3dConfig} />
            </div>
            <div className="settings-panel-btn-container">
                <button onClick={handleResetConfigs}>Reset</button>
                <button onClick={handleApplyConfigs}>Apply</button>
            </div>
        </div>
    );
}

//=============================================================================
function SettingsPanelGroup(props: ISettingsPanelGroupProps) {
    let [, forceUpdate] = useState(),
        configEntries: Array<configEntry> = Array.from(props.configMap.entries()) as Array<configEntry>;

    function handleChange(key: string, value: ConfigValue) {
        props.configMap.set(key, value);
        forceUpdate({} as any);
    }

    if (props.configPath === "cic3" || props.configPath === "mooble") {
        let priorityEntries: Array<configEntry> = [],
            noPriorityEntries: Array<configEntry> = [];

        configEntries.forEach((entry: configEntry) => {
            let entryName: string = entry[0] as string,
                priorityIndex: number = -1;

            /**
             * Base URLs First (BaseAPI + Geometries)
             * Rel Urls Second
             */
            if (entryName === "baseApiUrl") {
                priorityIndex = 0
            } else if (entryName === "geometriesApiUrl") {
                priorityIndex = 1
            }
            else if (entryName === "client") {
                priorityIndex = 2
            } else if (entryName === "region") {
                priorityIndex = 3

            } else if (entryName === "partnership") {
                priorityIndex = 4
            }

            if (priorityIndex > -1) {
                priorityEntries[priorityIndex] = entry
            } else {
                noPriorityEntries.push(entry);
            }
        });

        configEntries = ([] as Array<configEntry>).concat(priorityEntries, noPriorityEntries);
    }
    // cic3 order first
    // client / region / parternership

    return (
        <div className="settings-panel-config-group">
            <div className="settings-panel-label">{props.label}</div>
            <div className="settings-panel-config-entries">
                {configEntries.map(entry => <SettingsEntry key={props.label + entry[0]} label={entry[0] as string} path={props.configPath} value={entry[1] as string} onChange={handleChange} />)}
            </div>
        </div>
    );
}

//=============================================================================
function SettingsEntry(props: ISettingsEntryProps) {
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        props.onChange(props.label, e.target.value);
    }

    return (
        <div className="settings-panel-config-entry">
            <div className="settings-panel-config-entry-label">{props.label}</div>
            <input className="settings-panel-config-entry-input" type="text" value={props.value} onChange={handleChange} />
        </div>
    );
}