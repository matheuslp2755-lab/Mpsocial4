import React, { useState } from 'react';
import { User } from '../types';

interface SignupViewProps {
    users: User[];
    onSignupSuccess: (newUser: User) => void;
    onSwitchToLogin: () => void;
    t: (key: any) => string;
    language: 'en' | 'pt';
}

const SignupView: React.FC<SignupViewProps> = ({ users, onSignupSuccess, onSwitchToLogin, t, language }) => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignup = () => {
        if (!email || !username || !password) {
            setError(t('all_fields_required_error'));
            return;
        }

        const usernameExists = users.some(u => u.name.toLowerCase() === username.toLowerCase());
        if (usernameExists) {
            setError(t('username_taken_error'));
            return;
        }

        const newUser: User = {
            id: `u${users.length + 1}`,
            name: username,
            password: password,
            avatarUrl: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
            bio: t('default_bio'),
            followers: [],
            following: [],
        };

        setError('');
        onSignupSuccess(newUser);
    };

    return (
        <div className="min-h-screen bg-nexus-dark flex flex-col items-center justify-center p-4">
            <h1 className="text-4xl font-bold mb-2">{t('signup_title')}</h1>
            <p className="text-gray-400 mb-8">{t('signup_subtitle')}</p>
            
            <div className="w-full max-w-sm">
                {error && <p className="bg-red-500/20 text-red-400 text-center text-sm p-3 rounded-lg mb-4">{error}</p>}

                <input
                    type="email"
                    placeholder={t('email_placeholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-nexus-light-gray rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-nexus-secondary text-white"
                />
                <input
                    type="text"
                    placeholder={t('username_placeholder')}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-nexus-light-gray rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-nexus-secondary text-white"
                />
                <input
                    type="password"
                    placeholder={t('password_placeholder')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-nexus-light-gray rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-nexus-secondary text-white"
                />
                <button
                    onClick={handleSignup}
                    className="w-full bg-nexus-secondary text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity"
                >
                    {t('signup_button')}
                </button>
            </div>

            <div className="mt-8">
                <p className="text-gray-400">
                    {t('signup_prompt_login')}{' '}
                    <button onClick={onSwitchToLogin} className="font-semibold text-nexus-secondary hover:underline">
                        {t('login_link')}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default SignupView;
