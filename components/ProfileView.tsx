import React, { useState } from 'react';
import { User, Post } from '../types';
import { generateBio } from '../services/geminiService';
import { SparklesIcon } from './icons/Icon';

interface ProfileViewProps {
  profileUser: User;
  currentUser: User;
  posts: Post[];
  onEditProfile: () => void;
  onLogout: () => void;
  onFollowToggle: (targetUserId: string) => void;
  t: (key: any) => string;
  language: 'en' | 'pt';
}

const ProfileView: React.FC<ProfileViewProps> = ({ profileUser, currentUser, posts, onEditProfile, onLogout, onFollowToggle, t, language }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    const handleGenerateBio = async () => {
        setIsGenerating(true);
        const interests = "technology, vintage synths, sci-fi movies, and street photography";
        await generateBio(interests, language);
        // This functionality would need to be updated to save the bio to the user state in App.tsx
        // For now, we disable the visual update to prevent confusion, as it wasn't being saved.
        setIsGenerating(false);
    }

    const userPosts = posts.filter(post => post.user.id === profileUser.id);
    const isOwnProfile = profileUser.id === currentUser.id;
    const isFollowing = currentUser.following?.includes(profileUser.id);

    return (
        <div className="p-4">
            <header className="flex justify-between items-center mb-4">
                 <h2 className="text-xl font-bold">{profileUser.name}</h2>
                 {isOwnProfile && (
                     <div className="flex items-center space-x-4">
                        <button><i className="fa-solid fa-plus-square text-2xl"></i></button>
                        <button onClick={() => setShowSettings(true)}><i className="fa-solid fa-bars text-2xl"></i></button>
                     </div>
                 )}
            </header>

            <div className="flex items-center mb-4">
                <img src={profileUser.avatarUrl} alt={profileUser.name} className="w-24 h-24 rounded-full mr-6" />
                <div className="flex-1 flex justify-around text-center">
                    <div>
                        <p className="font-bold text-lg">{userPosts.length}</p>
                        <p className="text-sm text-gray-400">{t('profile_posts')}</p>
                    </div>
                     <div>
                        <p className="font-bold text-lg">{profileUser.followers?.length || 0}</p>
                        <p className="text-sm text-gray-400">{t('profile_followers')}</p>
                    </div>
                     <div>
                        <p className="font-bold text-lg">{profileUser.following?.length || 0}</p>
                        <p className="text-sm text-gray-400">{t('profile_following')}</p>
                    </div>
                </div>
            </div>

            <div className="mb-4">
                <p className="font-semibold">{profileUser.nickname ? `${profileUser.name} (${profileUser.nickname})` : profileUser.name}</p>
                <p className="text-sm text-gray-300">{profileUser.bio}</p>
            </div>
            
            <div className="flex items-center space-x-2 mb-4">
                {isOwnProfile ? (
                    <>
                        <button onClick={onEditProfile} className="flex-1 bg-nexus-light-gray font-semibold py-2 rounded-lg text-sm">{t('edit_profile_button')}</button>
                        <button 
                            onClick={handleGenerateBio}
                            disabled={isGenerating}
                            className="flex-1 bg-nexus-light-gray font-semibold py-2 rounded-lg text-sm flex items-center justify-center space-x-2 disabled:opacity-50"
                        >
                            <SparklesIcon />
                            <span>{isGenerating ? t('generating_button') : t('ai_bio_button')}</span>
                        </button>
                    </>
                ) : (
                     <button 
                        onClick={() => onFollowToggle(profileUser.id)}
                        className={`w-full font-semibold py-2 rounded-lg text-sm transition-colors ${
                            isFollowing
                                ? 'bg-nexus-light-gray text-white'
                                : 'bg-nexus-secondary text-white'
                        }`}
                    >
                        {isFollowing ? t('following_button') : t('follow_button')}
                    </button>
                )}
            </div>
            
            <div className="grid grid-cols-3 gap-1">
                {userPosts.map(post => (
                     <div key={post.id} className="aspect-square bg-nexus-gray">
                        {post.type === 'image' ? (
                            <img src={post.contentUrl} alt="Post" className="w-full h-full object-cover"/>
                        ): (
                            <div className="w-full h-full relative">
                                <video src={post.contentUrl} className="w-full h-full object-cover" muted playsInline></video>
                                <i className="fa-solid fa-play text-white absolute top-2 right-2 text-xs"></i>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Settings Modal */}
            {showSettings && (
                 <div className="fixed inset-0 bg-black/60 z-40 flex items-end" onClick={() => setShowSettings(false)}>
                    <div className="bg-nexus-gray w-full rounded-t-2xl p-4" onClick={e => e.stopPropagation()}>
                        <div className="w-10 h-1 bg-nexus-light-gray rounded-full mx-auto mb-4"></div>
                        <button onClick={onLogout} className="w-full text-left p-3 text-red-500 font-semibold hover:bg-nexus-light-gray rounded-lg">
                            {t('logout_button')}
                        </button>
                         <button onClick={() => setShowSettings(false)} className="w-full text-left p-3 mt-2 font-semibold hover:bg-nexus-light-gray rounded-lg">
                            {t('cancel_button')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileView;
