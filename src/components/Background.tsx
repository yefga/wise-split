import React from 'react';
import '@components/Background.css';

interface BackgroundProps {
    isDark: boolean;
}

export const Background: React.FC<BackgroundProps> = ({ isDark }) => {
    return (
        <>
            <div className="liquid-bg">
                {isDark ? (
                    <>
                        <div className="liquid-blob b1 bg-blue-600/40 mix-blend-screen"></div>
                        <div className="liquid-blob b2 bg-purple-700/40 mix-blend-screen"></div>
                        <div className="liquid-blob b3 bg-indigo-600/40 mix-blend-screen"></div>
                        <div className="liquid-blob b4 bg-cyan-600/30 mix-blend-screen"></div>
                    </>
                ) : (
                    <>
                        <div className="liquid-blob b1 bg-blue-300/60 mix-blend-multiply"></div>
                        <div className="liquid-blob b2 bg-pink-300/60 mix-blend-multiply"></div>
                        <div className="liquid-blob b3 bg-purple-300/60 mix-blend-multiply"></div>
                        <div className="liquid-blob b4 bg-cyan-300/50 mix-blend-multiply"></div>
                    </>
                )}
            </div>
        </>
    );
};
