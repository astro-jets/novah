'use client'

import React from 'react';

/**
 * A full-screen, aesthetically pleasing loading modal for a dark-themed application.
 * It uses a semi-transparent dark background to dim the main content and a custom
 * animated spinner for the loading indication.
 * * @param {object} props - Component props.
 * @param {boolean} props.isLoading - Whether the modal should be visible.
 * @param {string} [props.message] - Optional message to display below the spinner.
 */

type props = {
    isLoading: boolean;
    message?: string;
}

const LoadingModal = ({ isLoading, message = "Loading data..." }: props) => {
    // If not loading, return null to render nothing
    if (!isLoading) {
        return null;
    }

    return (
        // Modal Overlay: Fixed position, full screen, high z-index, semi-transparent dark background
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-90 backdrop-blur-sm transition-opacity duration-300">

            {/* Modal Content Container: Central card with subtle dark background */}
            <div className="flex flex-col w-1/2 items-center justify-center p-8">

                {/* Custom CSS Spinner */}
                <div className="loader  ease-linear rounded-full border-4 border-t-4 border-gray-700 h-12 w-12 mb-4"></div>

                {/* Loading Message */}
                <p className="text-gray-300 text-lg font-medium animate-pulse">
                    {message}
                </p>
            </div>

            {/*
                Aesthetic CSS for the 'loader' spinner, ensuring a smooth, dark-mode look.
                We use the border-t-4 with the primary theme color (cyan/sky-400) for the animated part.
            */}
            <style jsx>{`
                .loader {
                    /* Custom property to use the Tailwind sky color */
                    border-top-color: #38bdf8; /* sky-400 */
                    -webkit-animation: spinner 1.5s linear infinite;
                    animation: spinner 1.5s linear infinite;
                }
                
                @-webkit-keyframes spinner {
                    0% { -webkit-transform: rotate(0deg); }
                    100% { -webkit-transform: rotate(360deg); }
                }
                
                @keyframes spinner {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default LoadingModal;