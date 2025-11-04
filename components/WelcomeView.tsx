import React from 'react';
import { User } from '../types';

interface WelcomeViewProps {
    user: User;
}

const Fireworks: React.FC = () => {
    const fireworksCount = 15; // Number of firework containers
    const particleCount = 25; // Particles per firework

    return (
        <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: fireworksCount }).map((_, i) => (
                 <div
                    key={i}
                    className="firework"
                    style={{
                        top: `${Math.random() * 80 + 10}%`,
                        left: `${Math.random() * 80 + 10}%`,
                        transform: `scale(${Math.random() * 0.5 + 0.5})`,
                        animation: `explode 0.7s cubic-bezier(0, .9, .57, 1) ${i * 0.1}s forwards`,
                    }}
                >
                    {Array.from({ length: particleCount }).map((_, j) => (
                        <div
                            key={j}
                            className="particle"
                            style={{
                                transform: `rotate(${Math.random() * 360}deg)`,
                                '--x': `${(Math.random() - 0.5) * 25}vmin`,
                                '--y': `${(Math.random() - 0.5) * 25}vmin`,
                                '--bg': `hsl(${Math.random() * 360}, 100%, 50%)`,
                            } as React.CSSProperties}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};


const WelcomeView: React.FC<WelcomeViewProps> = ({ user }) => {
    return (
        <div className="min-h-screen bg-nexus-dark flex flex-col items-center justify-center p-4 relative overflow-hidden">
             <style>{`
                .animate-welcome {
                    animation: fade-in-out 2.5s ease-in-out forwards;
                }
                @keyframes fade-in-out {
                    0% { opacity: 0; transform: scale(0.95); }
                    20% { opacity: 1; transform: scale(1); }
                    80% { opacity: 1; transform: scale(1); }
                    100% { opacity: 0; transform: scale(0.95); }
                }

                .firework {
                    position: absolute;
                    opacity: 0;
                }

                @keyframes explode {
                    to {
                        opacity: 1;
                    }
                }

                .particle {
                    position: absolute;
                    width: 0.5vmin;
                    height: 0.5vmin;
                    background: var(--bg);
                    border-radius: 50%;
                    animation: fly 0.7s 0.1s cubic-bezier(.24, 1.05, .63, .99) forwards;
                }

                @keyframes fly {
                    0% {
                        transform: translate(0, 0) scale(1);
                        opacity: 1;
                    }
                    100% {
                        transform: translate(var(--x), var(--y)) scale(0);
                        opacity: 0;
                    }
                }
             `}</style>
             <Fireworks />
            <div className="animate-welcome z-10">
                <h1 className="text-5xl font-bold font-serif mb-4 text-center">MP SOCIAL</h1>
                <p className="text-2xl text-gray-300 text-center">Welcome, {user.name}!</p>
            </div>
        </div>
    );
};

export default WelcomeView;