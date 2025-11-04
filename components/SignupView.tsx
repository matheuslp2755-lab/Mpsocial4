import React, { useState } from 'react';
import { User } from '../types';

interface SignupViewProps {
    users: User[];
    onSignupSuccess: (newUser: User) => void;
    onSwitchToLogin: () => void;
}

const SignupView: React.FC<SignupViewProps> = ({ users, onSignupSuccess, onSwitchToLogin }) => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignup = () => {
        if (!email || !username || !password) {
            setError('All fields are required.');
            return;
        }

        const usernameExists = users.some(u => u.name.toLowerCase() === username.toLowerCase());
        if (usernameExists) {
            setError('This username is already taken.');
            return;
        }

        const newUser: User = {
            id: `u${users.length + 1}`,
            name: username,
            password: password,
            avatarUrl: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
            bio: 'Just joined MP SOCIAL! ✨',
            followers: [],
            following: [],
        };

        setError('');
        onSignupSuccess(newUser);
    };

    return (
        <div className="min-h-screen bg-nexus-dark flex flex-col items-center justify-center p-4">
            <h1 className="text-4xl font-bold mb-2">Create Account</h1>
            <p className="text-gray-400 mb-8">Join the MP SOCIAL community.</p>
            
            <div className="w-full max-w-sm">
                {error && <p className="bg-red-500/20 text-red-400 text-center text-sm p-3 rounded-lg mb-4">{error}</p>}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-nexus-light-gray rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-nexus-secondary text-white"
                />
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
                    onClick={handleSignup}
                    className="w-full bg-nexus-secondary text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity"
                >
                    Sign Up
                </button>
            </div>

            <div className="mt-8">
                <p className="text-gray-400">
                    Already have an account?{' '}
                    <button onClick={onSwitchToLogin} className="font-semibold text-nexus-secondary hover:underline">
                        Log In
                    </button>
                </p>
            </div>
        </div>
    );
};

export default SignupView;