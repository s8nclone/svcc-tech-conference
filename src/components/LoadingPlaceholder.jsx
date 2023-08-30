import React from 'react';
import { Placeholder } from 'react-bootstrap';

function LoadingPlaceholder() {
    return (
        <div className="placeholder-list">
            <Placeholder as="p" animation="glow">
                <Placeholder sm={6} />
                <Placeholder className="w-75" size="sm"/>
                <Placeholder sm={12} size="xs"/>
                <Placeholder sm={6} />
                <Placeholder className="w-75" size="sm"/>
                <Placeholder sm={12} size="sm"/>
                <Placeholder sm={6} />
                <Placeholder sm={12} size="sm"/>
                <Placeholder className="w-75" size="sm"/>
            </Placeholder>
        </div>
    );
}

export default LoadingPlaceholder;
