import React, { useState } from 'react';
import { User } from '../types';

interface LoginViewProps {
    users: User[];
    onLoginSuccess: (user: User) => void;
    onSwitchToSignup: () => void;
    language: 'en' | 'pt';
    setLanguage: (lang: 'en' | 'pt') => void;
    t: (key: any) => string;
}

const LoginView: React.FC<LoginViewProps> = ({ users, onLoginSuccess, onSwitchToSignup, language, setLanguage, t }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = () => {
        const user = users.find(u => u.name.toLowerCase() === username.toLowerCase());
        
        if (user && user.password === password) {
            setError('');
            onLoginSuccess(user);
        } else {
            setError(t('invalid_credentials_error'));
        }
    };

    return (
        <div className="min-h-screen bg-nexus-dark flex flex-col items-center justify-center p-4">
            <h1 className="text-4xl font-bold mb-2">MP SOCIAL</h1>
            <p className="text-gray-400 mb-6">{t('login_subtitle')}</p>

            <div className="w-full max-w-sm mb-6">
                <p className="text-center text-gray-400 mb-3 text-sm">{t('select_language')}</p>
                <div className="flex space-x-2">
                    <button onClick={() => setLanguage('pt')} className={`w-full py-3 rounded-lg font-semibold transition-colors text-sm ${language === 'pt' ? 'bg-nexus-secondary text-white' : 'bg-nexus-light-gray text-gray-300'}`}>
                        {t('language_pt')}
                    </button>
                    <button onClick={() => setLanguage('en')} className={`w-full py-3 rounded-lg font-semibold transition-colors text-sm ${language === 'en' ? 'bg-nexus-secondary text-white' : 'bg-nexus-light-gray text-gray-300'}`}>
                        {t('language_en')}
                    </button>
                </div>
            </div>
            
            <div className="w-full max-w-sm">
                {error && <p className="bg-red-500/20 text-red-400 text-center text-sm p-3 rounded-lg mb-4">{error}</p>}
                
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
                    onClick={handleLogin}
                    className="w-full bg-nexus-secondary text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity"
                >
                    {t('login_button')}
                </button>
            </div>

            <div className="mt-8">
                <p className="text-gray-400">
                    {t('login_prompt_signup')}{' '}
                    <button onClick={onSwitchToSignup} className="font-semibold text-nexus-secondary hover:underline">
                        {t('signup_link')}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginView;