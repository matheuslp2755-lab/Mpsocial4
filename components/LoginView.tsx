import React, { useState } from 'react';
import { User } from '../types';

interface LoginViewProps {
    users: User[];
    onLoginSuccess: (user: User) => void;
    onSwitchToSignup: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ users, onLoginSuccess, onSwitchToSignup }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = () => {
        // Find user by username (case-insensitive) and check password.
        const user = users.find(u => u.name.toLowerCase() === username.toLowerCase());
        
        if (user && user.password === password) {
            setError('');
            onLoginSuccess(user);
        } else {
            setError('Invalid username or password.');
        }
    };

    return (
        <div className="min-h-screen bg-nexus-dark flex flex-col items-center justify-center p-4">
            <h1 className="text-4xl font-bold mb-2">Nexus</h1>
            <p className="text-gray-400 mb-8">Sign in to continue.</p>
            
            <div className="w-full max-w-sm">
                {error && <p className="bg-red-500/20 text-red-400 text-center text-sm p-3 rounded-lg mb-4">{error}</p>}
                
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-nexus-light-gray rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-nexus-secondary text-white"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-nexus-light-gray rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-nexus-secondary text-white"
                />
                <button
                    onClick={handleLogin}
                    className="w-full bg-nexus-secondary text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity"
                >
                    Log In
                </button>
            </div>

            <div className="mt-8">
                <p className="text-gray-400">
                    Don't have an account?{' '}
                    <button onClick={onSwitchToSignup} className="font-semibold text-nexus-secondary hover:underline">
                        Sign Up
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginView;