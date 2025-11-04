import React from 'react';
import { User } from '../types';

interface WelcomeViewProps {
    user: User;
}

const WelcomeView: React.FC<WelcomeViewProps> = ({ user }) => {
    return (
        <div className="min-h-screen bg-nexus-dark flex flex-col items-center justify-center p-4">
             <style>{`
                @keyframes fade-in-out {
                    0% { opacity: 0; transform: scale(0.95); }
                    20% { opacity: 1; transform: scale(1); }
                    80% { opacity: 1; transform: scale(1); }
                    100% { opacity: 0; transform: scale(0.95); }
                }
                .animate-welcome {
                    animation: fade-in-out 2.5s ease-in-out forwards;
                }
             `}</style>
            <div className="animate-welcome">
                <h1 className="text-5xl font-bold font-serif mb-4 text-center">Nexus</h1>
                <p className="text-2xl text-gray-300 text-center">Welcome, {user.name}!</p>
            </div>
        </div>
    );
};

export default WelcomeView;
