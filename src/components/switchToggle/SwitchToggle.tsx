import React, { useEffect, useState } from 'react';
import './switchToggle.scss';

interface ISwitchToggleProps {
    label?: string;
    mode?: string; // boring | normal
    checked: boolean;
    disabled?: boolean;
    onChange(ev: React.ChangeEvent<HTMLInputElement>): void;
}

export default function SwitchToggle(props: ISwitchToggleProps) {
    let [checked, setChecked] = useState(false),
        [disabled, setDisabled] = useState(false),
        label: JSX.Element | undefined;

    useEffect(() => {
        if (props.checked) {
            setChecked(props.checked);
        }

        if (props.disabled) {
            setDisabled(props.disabled);
        }
    }, []);

    useEffect(() => {
        setChecked(props.checked!);
    }, [props.checked]);

    function handleInputChanged(ev: React.ChangeEvent<HTMLInputElement>) {
        setChecked(ev.target.checked);
        props.onChange(ev);
    }

    if (props.label) {
        label = <div className="switch-toggle-label">{props.label}</div>
    }
    return (
        <div className="switch-toggle-container">
            {props.mode === "boring" &&
                <>
                    <input type="checkbox" checked={checked} onChange={handleInputChanged} disabled={disabled} />
                    {label}
                </>
            }
            {!props.mode &&
                <>
                    {label}
                    <label className="switch-toggle-switch">
                        <input type="checkbox" checked={checked} onChange={handleInputChanged} disabled={disabled} />
                        <span className="switch-toggle-slider round"></span>
                    </label>
                </>
            }
        </div>
    );
}


