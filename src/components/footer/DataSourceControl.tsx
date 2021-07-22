import React, { useEffect, useState } from "react";
import DataSourceCheckbox from "./DataSourceCheckbox";

interface IDataSourceControlProps {
    // onChange: Function
}

//=============================================================================
export default function DataSourceControl(props: IDataSourceControlProps) {
    let cic3Source = useDataSourceCheckbox(CiCAPI.content.constants.DATA_SOURCES.cic3, "CiC3", false),
        moobleSource = useDataSourceCheckbox(CiCAPI.content.constants.DATA_SOURCES.mooble, "Mooble", false),
        cic2Source = useDataSourceCheckbox(CiCAPI.content.constants.DATA_SOURCES.cic2, "CiC2", false);

    return (
        <div className="footer-data-source centered-flex">
            <span className="footer-label">Sources: </span>
            <DataSourceCheckbox {...cic3Source} />
            <DataSourceCheckbox {...moobleSource} />
            <DataSourceCheckbox {...cic2Source} />
        </div>
    );
}

//=============================================================================
function useDataSourceCheckbox(source: string, label: string, defaultState: boolean) {
    let [isSourceChecked, setSourceChecked] = useState(defaultState);

    useEffect(() => {
        setSourceChecked(_isSourceEnabled(source as DATA_SOURCES));
        return () => {}
    }, []);

    function _toggleSource(e: React.ChangeEvent<HTMLInputElement>) {
        let isChecked:boolean = e.target.checked;
        setSourceChecked(isChecked);
        // data manager.setUseSource(source, e.target.checked);
        CiCAPI.setConfig(`sources.${source.toLowerCase()}_enabled`, isChecked);
    }

    return {
        source: source,
        label: label,
        isChecked: isSourceChecked || false,
        onChange: _toggleSource
    };
}


// move to utils ?
//=============================================================================
function _isSourceEnabled(src: DATA_SOURCES): boolean {
    console.log(">>> DATA SOURCE CONTROL CALLING GET CONFIG ");
    return CiCAPI.getConfig(`sources.${src.toLowerCase()}_enabled`) as boolean;
}