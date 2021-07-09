import React from 'react';
import ProfilePreview from './ProfilePreview';
import './header.scss';

interface HeaderProps {
    isLoggedIn: boolean,
    onLoginStatechanged: Function,
    onProfileToggle: Function
}

//=============================================================================
export default function Header(props: HeaderProps) {
    return (
        <header className="header-root">
            <img src="./assets/images/logo.png" alt="" className="header-logo" />
            <div className="header-title">Content Platform Tester App</div>
            <div className="flex-filler"></div>
            <ProfilePreview isLoggedIn={props.isLoggedIn} onProfileToggle={props.onProfileToggle} />
        </header>
    );
}