import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';

function AppContainer({name, icon}) {
    let navigate = useNavigate();

    return (
        <div className="app-container" onClick={() => navigate(`/${name}`)}>
        <FontAwesomeIcon icon={icon} className="icon" />
        <h1>{name}</h1>
    </div>
    );
}

export default AppContainer;