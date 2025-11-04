import React, { useState } from 'react';
import { User } from '../types';

interface SignupViewProps {
    onSignupSuccess: (newUser: Omit<User, 'id'>) => Promise<{ success: boolean; error?: string }>;
    onSwitchToLogin: () => void;
    t: (key: any) => string;
    language: 'en' | 'pt';
}

const SignupView: React.FC<SignupViewProps> = ({ onSignupSuccess, onSwitchToLogin, t }) => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSignup = async () => {
        if (!email || !username || !password) {
            setError(t('all_fields_required_error'));
            return;
        }

        setIsLoading(true);
        setError('');

        const newUserPartial: Omit<User, 'id'> = {
            name: username,
            password: password,
            avatarUrl: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
            bio: t('default_bio'),
            followers: [],
            following: [],
        };
        
        const result = await onSignupSuccess(newUserPartial);

        if (!result.success) {
            setError(result.error || 'Failed to create account.');
        }
        setIsLoading(false);
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
                    disabled={isLoading}
                    className="w-full bg-nexus-secondary text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                    {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div> : t('signup_button')}
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