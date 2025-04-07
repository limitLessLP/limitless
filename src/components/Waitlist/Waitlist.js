import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Waitlist = () => {
    const navigate = useNavigate();
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');

    const handleReturnHome = () => {
        navigate('/');
    };

    if (success !== 'true') {
        return (
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <h1>Signup Failed</h1>
                <p>There was an issue with your signup. Please try again.</p>
                <button onClick={handleReturnHome} style={{ marginTop: '20px' }}>Return to Home</button>
            </div>
        );
    } else {
        return (
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <h1>Signup Successful!</h1>
                <p>Thank you for signing up. You will be notified when we launch.</p>
                <button onClick={handleReturnHome} style={{ marginTop: '20px' }}>Return to Home</button>
            </div>
        );
    }
}
