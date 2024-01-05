import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function AppContainer({name, icon}) {
    return (
        <div className="app-container">
        <FontAwesomeIcon icon={icon} className="icon" />
        <h1>{name}</h1>
    </div>
    );
}

export default AppContainer;
