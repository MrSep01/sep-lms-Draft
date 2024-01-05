import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { HANDLE_STRIPE_CALLBACK } from '../../utils/mutations';
import { useStoreContext } from '../../utils/GlobalState';

const StripeOnboardingComplete = () => {
    const navigate = useNavigate();
    const [state, dispatch] = useStoreContext();

    const [handleStripeCallback, { loading, error }] = useMutation(HANDLE_STRIPE_CALLBACK, {
        onCompleted: (data) => {
            dispatch({
                type: 'UPDATE_USER',
                payload: data.handleStripeCallback // Assuming this contains the updated user info
            });
            navigate('/instructor/dashboard'); // Navigate to the instructor dashboard
        }
    });

    useEffect(() => {
        handleStripeCallback();
    }, [handleStripeCallback]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div>
            <h1>Completing your instructor setup...</h1>
        </div>
    );
};

export default StripeOnboardingComplete;
