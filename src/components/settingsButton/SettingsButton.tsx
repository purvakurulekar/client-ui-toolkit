import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import "./settingsButton.scss";

interface ISettingsButtonProps {
    onClick?(): void,
    onOpen?(): void,
    onClose?(): void
    children?: any
}

export default function SettingsButton(props: ISettingsButtonProps) {
    let [isOpened, setOpened] = useState(false);

    function handleClick(ev: React.MouseEvent) {
        let openState: boolean = !isOpened;

        if (props.onClick) {
            props.onClick();
        }

        if (openState && props.onOpen) {
            props.onOpen();
        } else if (!openState && props.onClose) {
            props.onClose();
        }
        
        setOpened(openState);
    }

    return (
        <div className="settings-button-container">
            <button className="settings-btn" onClick={handleClick}><FontAwesomeIcon icon={faCog} /></button>
            {isOpened && props.children}
        </div>
    );
}
