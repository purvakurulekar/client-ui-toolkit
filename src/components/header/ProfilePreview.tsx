import React, { useState, useContext } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserAlt } from "@fortawesome/free-solid-svg-icons";

interface Props {
    isLoggedIn: boolean,
    onProfileToggle: Function
}

let g_oContext = {};

//=============================================================================
function ProfilePreview(props: Props) {
    let [isSelected, setSelected] = useState(false),
        l_oContent,
        l_aBtnClassNames = ["btn-default"],
        l_fnOnClick = () => {
            let l_bSelected = !isSelected;
            setSelected(l_bSelected);
            if (props.onProfileToggle) {
                props.onProfileToggle(l_bSelected);
            }
        }

    if (isSelected) {
        l_aBtnClassNames.push("profile-btn-selected");
    }

    if (props.isLoggedIn) {
        l_oContent = (
            <div className="profile-view">
                <button className={l_aBtnClassNames.join(" ")} onClick={l_fnOnClick}>
                    <div className="profile-icon-container">
                        <FontAwesomeIcon icon={faUserAlt} />
                    </div>
                </button>
            </div>
        );
    }

    return (
        <div className="profile-container">
            {l_oContent}
        </div>
    );
}

export default ProfilePreview;