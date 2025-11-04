import React, { useState } from 'react';
import { User } from '../types';

interface SearchViewProps {
    users: User[];
    currentUser: User;
    onFollowToggle: (targetUserId: string) => void;
    onViewProfile: (user: User) => void;
    onClose: () => void;
    t: (key: any) => string;
}

const SearchView: React.FC<SearchViewProps> = ({ users, currentUser, onFollowToggle, onViewProfile, onClose, t }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.nickname?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-full flex flex-col bg-nexus-dark">
            <header className="flex items-center p-4 border-b border-nexus-light-gray sticky top-0 bg-nexus-dark/80 backdrop-blur-lg z-10">
                <button onClick={onClose} className="mr-4">
                    <i className="fa-solid fa-chevron-left text-lg"></i>
                </button>
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder={t('search_users_placeholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                        className="w-full bg-nexus-light-gray rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-nexus-secondary"
                    />
                    <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-2">
                {filteredUsers.length > 0 ? filteredUsers.map(user => {
                    const isFollowing = currentUser.following?.includes(user.id);
                    return (
                        <div key={user.id} className="flex items-center justify-between p-3 hover:bg-nexus-light-gray rounded-lg">
                            <div className="flex items-center cursor-pointer flex-1 min-w-0" onClick={() => onViewProfile(user)}>
                                <img src={user.avatarUrl} alt={user.name} className="w-12 h-12 rounded-full mr-4" />
                                <div className="min-w-0">
                                    <p className="font-semibold truncate">{user.name}</p>
                                    {user.nickname && <p className="text-sm text-gray-400 truncate">{user.nickname}</p>}
                                </div>
                            </div>
                            <button 
                                onClick={() => onFollowToggle(user.id)}
                                className={`font-semibold py-1 px-4 rounded-lg text-sm transition-colors flex-shrink-0 ml-2 ${
                                    isFollowing
                                        ? 'bg-nexus-light-gray text-white'
                                        : 'bg-nexus-secondary text-white'
                                }`}
                            >
                                {isFollowing ? t('following_button') : t('follow_button')}
                            </button>
                        </div>
                    );
                }) : (
                    <div className="text-center p-16 text-gray-400">
                        <p>No users found.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default SearchView;